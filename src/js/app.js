/**
 * @module poletop-finder/App
 */

import $ from 'jquery'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import decorations from './decorations'
import facilityStyle from './facility-style'
import poletop from './poletop'
import fetchTimeout from 'nyc-lib/nyc/fetchTimeout'
import {fromExtent as polygonFromExtent} from 'ol/geom/Polygon'
import FilterAndSort from 'nyc-lib/nyc/ol/source/FilterAndSort'
import {containsExtent} from 'ol/extent'
import Papa from 'papaparse'

class App extends FinderApp {
	/**
	 * @desc Create an instance of App
	 * @public
	 * @constructor
	 */
	constructor() {
		super({
			title: 'Mobile Telecommunications Poletop Infrastructure Locations',
			facilityStyle: facilityStyle.style,
			highlightStyle: facilityStyle.highLightStyle,
			facilityTabTitle: 'Locations',
			geoclientUrl: poletop.GEOCLIENT_URL,
			splashOptions: App.getSplashOptions(document.location.search),
			filterChoiceOptions: [{
				title: 'Construction Status',
				choices: [
					{name: 'status', values: ['Proposed'], label: 'Proposed', checked: true},
					{name: 'status', values: ['Approved'], label: 'Approved', checked: true},
					{name: 'status', values: ['Installed'], label: 'Installed', checked: true}
				]
			}]
    })
    this.rearrangeLayers()
		this.view.on('change', $.proxy(this.cluster, this))
		this.extents = []
  }
  rearrangeLayers() {
		this.layer.setZIndex(5000)
		this.highlightLayer.setZIndex(5001)
  }
	zoomTo(feature) {
    const popup = this.popup
    if ($('#tabs .btns h2:first-of-type').css('display') !== 'none') {
      this.tabs.open('#map')
    }
		if (!feature.isCommunityBoard) {
			this.map.once('moveend', () => {
				const panIntoView = popup.panIntoView
				popup.panIntoView = App.noPanIntoView
				popup.showFeature(feature)
				popup.panIntoView = panIntoView
			})
		}
    this.view.animate({
      center: feature.getGeometry().getCoordinates(),
      zoom: $('body').hasClass('community-board') ? 14 : 17
    })
  }
	zoomToArea(event) {
		const feature = $(event.currentTarget).data('feature')
		this.popup.hide()
		this.zoomTo(feature)
	}
	getUrl() {
		const extent = this.view.calculateExtent(this.map.getSize())
		if (this.extents.some(old => {return containsExtent(old, extent)})) {
			return
		}
		this.extents.push(extent)
		extent[0] = extent[0] - 500
		extent[1] = extent[1] - 500
		extent[2] = extent[2] + 500
		extent[3] = extent[3] + 500
		const ext = polygonFromExtent(extent)
      .transform('EPSG:3857', 'EPSG:2263')
      .getExtent()
		const where = `x_coord > ${ext[0]} and x_coord < ${ext[2]} and y_coord > ${ext[1]} and y_coord < ${ext[3]}`
		return `${poletop.POLE_DATA_URL}&$where=${encodeURIComponent(where)}`
	}
  createSource() {
		this.communityBoardCounts = {}
		this.poleSrc = new FilterAndSort({})
		this.poleSrc._name = 'pole'
		this.cdSrc = super.createSource({
			facilityUrl: poletop.COMMUNITY_BOARD_URL,
			decorations: [decorations.common, decorations.communityBoard],
			facilityFormat: new CsvPoint({
				x: 'x',
				y: 'y',
				dataProjection: 'EPSG:2263'
			})
		})
		this.cdSrc._name = 'cd'
		fetchTimeout(poletop.GROUPED_DATA_URL).then(response => {
			response.text().then(csv => {
				const rows = Papa.parse(csv, {header: true}).data
				rows.forEach(row => {
					this.communityBoardCounts[row.community_board] = row.count
				})
				this.layer.changed()
				this.resetList()
			})
		})
		return this.cdSrc
	}
	cluster() {
		const prevSrc = this.source
		if (this.view.getZoom() < poletop.CLUSTER_CUTOFF_ZOOM) {
			$('body').addClass('community-board')
			this.layer.setSource(this.cdSrc)
			this.source = this.cdSrc
			if (this.tabs.active.attr('id') === 'filters') {
				this.tabs.open('#facilities')
			}
			$('#tabs').addClass('no-flt')
			this.srcChange(prevSrc)
		} else {
			const url = this.getUrl()
			$('body').removeClass('community-board')
			if (url) {
				const poleSrc = super.createSource({
					facilityUrl: url,
					decorations: [decorations.common, decorations.pole],
					facilityFormat: new CsvPoint({
						id: 'id',
						x: 'x_coord',
						y: 'y_coord',
						dataProjection: 'EPSG:2263'
					})
				})
				poleSrc.autoLoad().then(features => {
					if (this.poleSrc.allFeatures.length > 0) {
						features.forEach(feature => {
							if (!this.poleSrc.getFeatureById(feature.getId())) {
								this.poleSrc.allFeatures.push(feature)
							}
						})
					} else {
						this.poleSrc.allFeatures = features
					}
					this.showPoles(prevSrc)
				})				
			} else {
				this.showPoles(prevSrc)
			}
		}
	}
	showPoles(prevSrc) {
		this.source = this.poleSrc
		$('#tabs').removeClass('no-flt')
		this.poleSrc.filter(this.filters.getFilters())
		if (this.location.coordinate) {
			this.poleSrc.sort(this.location.coordinate)
			this.resetList()
		}
		this.filters.source = this.poleSrc
		this.layer.setSource(this.poleSrc)
		this.srcChange(prevSrc)
	}
	srcChange(prevSrc) {
		if (this.source._name !== prevSrc._name) {
			this.resetList()
			this.highlightSource.clear()
		}
	}
	resetList(event) {
    const hide = this.popup.hide
		if (this.source !== this.cdSrc) {
			this.popup.hide = () => {}
		}
		super.resetList(event)
    this.popup.hide = hide
	}
  mobileDiaOpts() {
    const location = this.location
    const locationName = location.name
    const feature = this.source.sort(location.coordinate)[0]
    const options = {
      buttonText: [
        `<span class="msg-vw-list">View ${$('#tab-btn-1').text()} list</span>`,
        '<span class="msg-vw-map">View the map</span>'
			],
			message: `<strong>${locationName}</strong>`
    }
    return options
  }
}
App.noPanIntoView = () => {}
App.getSplashOptions = (search) => {
	if (search.indexOf('splash=false') === -1) {
		return {
			message: poletop.SPLASH_MESSAGE,
			buttonText: ['Screen reader instructions', 'View map']
		}
	}
}
export default App