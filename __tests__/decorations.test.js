import Feature from 'ol/Feature'
import {poleFeature1, cbFeature} from './test-features'
import decorations from '../src/js/decorations'
import ReplaceTokens from 'nyc-lib/nyc/ReplaceTokens'

beforeEach(() => {
  $.resetMocks()
})

describe('common', () => {
  test('getCommunityBoardNum', () => {
    expect.assertions(1)
    
    expect(cbFeature.getCommunityBoardNum()).toBe('5')
  })
  test('getBoroNum', () => {
    expect.assertions(1)
    
    expect(cbFeature.getBoroNum()).toBe('2')
  })
  test('getBoroName', () => {
    expect.assertions(5)

    expect(Object.assign(new Feature({'community_board': '100'}), decorations.common).getBoroName()).toBe('Manhattan')
    expect(Object.assign(new Feature({'community_board': '200'}), decorations.common).getBoroName()).toBe('Bronx')
    expect(Object.assign(new Feature({'community_board': '300'}), decorations.common).getBoroName()).toBe('Brooklyn')
    expect(Object.assign(new Feature({'community_board': '400'}), decorations.common).getBoroName()).toBe('Queens')
    expect(Object.assign(new Feature({'community_board': '500'}), decorations.common).getBoroName()).toBe('Staten Island')
  })
  test('getCommunityBoardName', () => {
    expect.assertions(1)
    
    expect(cbFeature.getCommunityBoardName()).toBe('Bronx Community Board 5')
  })
})

describe('communityBoard', () => {
  test('extendFeature', () => {
    expect.assertions(1)
    
    cbFeature.extendFeature()
    expect(cbFeature.isCommunityBoard).toBe(true)
  })
  test('html', () => {
    expect.assertions(2)
    
    const div = $('<div></div>').html(cbFeature.html())
    expect(div.html()).toBe('<div class="facility"><div><div class="name">Bronx Community Board 5</div><div>100 4G poles<div></div></div></div><button class="btn rad-all">Zoom to Area</button></div>')
    expect(cbFeature.html().data('feature')).toBe(cbFeature)
  })
  test('getName', () => {
    expect.assertions(1)
    
    expect(cbFeature.getName()).toEqual($('<div class="name">Bronx Community Board 5</div>'))
  })
  test('zoomBtn', () => {
    expect.assertions(5)
    
    expect(cbFeature.zoomBtn()).toEqual($('<button class="btn rad-all">Zoom to Area</button>'))
    expect(cbFeature.zoomBtn().data('feature')).toBe(cbFeature)
    $.resetMocks()
  
    $(cbFeature.zoomBtn()).trigger('mouseover')
  
    expect($.proxy).toHaveBeenCalledTimes(1)
    expect($.proxy.mock.calls[0][0]).toBe(cbFeature.app.zoomToArea)
    expect($.proxy.mock.calls[0][1]).toBe(cbFeature.app)

  })
  test('getTip', () => {
    expect.assertions(1)
    
    expect(cbFeature.getTip()).toEqual($('<div><div class="name">Bronx Community Board 5</div><div>100 4G poles<div></div></div></div>'))
  })
  test('getCount', () => {
    expect.assertions(2)
    expect(cbFeature.getCount()).toBe(100)
    cbFeature.app.communityBoardCounts = {'200': 100}
    expect(cbFeature.getCount()).toBe(0)

    cbFeature.app.communityBoardCounts = {'205': 100}
  })
})


describe('pole', () => {
  let extendedDecorations
  beforeEach(() => {
    extendedDecorations = {
      nameHtml() {
        return '<p>A Name</p>'
      },
      distanceHtml() {
        return '<p>A Distance</p>'
      },
      mapButton() {
        return '<p>Map</p>'
      },
      addressHtml() {
        return '<p>An Address</p>'
      },
      detailsCollapsible() {
        return '<p>Details collapsible</p>'
      }
    }
    $.extend(poleFeature1, extendedDecorations)
  })
  test('extendFeature', () => {
    expect.assertions(1)
    poleFeature1.extendFeature()
    expect(poleFeature1.replace).toBe(new ReplaceTokens().replace)
  })
  test('cssClass', () => {
    expect.assertions(3)
    expect(Object.assign(new Feature({'status': 'Proposed'}), decorations.pole).cssClass()).toBe('proposed')
    expect(Object.assign(new Feature({'status': 'Installed'}), decorations.pole).cssClass()).toBe('installed')
    expect(Object.assign(new Feature({'status': 'Approved'}), decorations.pole).cssClass()).toBe('approved')
  })
  test('html', () => {
    const div = $('<div></div>').html(poleFeature1.html())
    expect(div.html()).toBe('<div class="facility proposed" data-fid="1"><p>A Distance</p><p>A Name</p><p>A Distance</p><p>An Address</p><div><strong>Community Board: </strong>5</div><div><strong>Council District: </strong>100</div><p>Map</p><p>Details collapsible</p></div>')
  })
  test('getFranchisee', () => {
    expect.assertions(1)
    expect(poleFeature1.getFranchisee()).toBe('franchisee')
  })
  test('getName', () => {
    expect.assertions(1)
    expect(poleFeature1.getName()).toBe('Poletop Reservation ID 1')
  })
  test('getAddress1', () => {
    expect.assertions(1)
    expect(poleFeature1.getAddress1()).toBe('Ave P')
  })
  test('getAddress2', () => {
    expect.assertions(1)
    expect(poleFeature1.getAddress2()).toBe('Between W 9th St and W 10th St')
  })
  test('getCityStateZip', () => {
    expect.assertions(1)
    expect(poleFeature1.getCityStateZip()).toBe('Brooklyn, NY ZIP')
  })
  test('getPoleType', () => {
    expect.assertions(2)
    expect(Object.assign(new Feature({'pole_type': 'CITY'}), decorations.pole).getPoleType()).toBe('City (Public)')
    expect(Object.assign(new Feature({'pole_type': 'UTILITY'}), decorations.pole).getPoleType()).toBe('Utility Company (Private)')
    
  })
  test('getZone', () => {
    expect.assertions(3)
    expect(Object.assign(new Feature({'zone': 'A'}), decorations.pole).getZone()).toBe('A - Manhattan South of 96th Street')
    expect(Object.assign(new Feature({'zone': 'B'}), decorations.pole).getZone()).toBe('B - All boroughs excluding those areas in Zones A and C')
    expect(Object.assign(new Feature({'zone': 'C'}), decorations.pole).getZone()).toBe('C - Parts of Harlem, the South Bronx and East New York (Brooklyn)')
    
  })
  test('getCouncilDistrict', () => {
    expect.assertions(1)
    expect(poleFeature1.getCouncilDistrict()).toBe('100')
  })
  test('reservationDate', () => {
    expect.assertions(1)

    expect(poleFeature1.reservationDate()).toBe('12/29/2017')
  })
  describe('detailsHtml', () => {
    let ul
    beforeEach(() => {
      ul = $('<ul></ul>')
      .append(`<li><strong>Ownership: </strong>${poleFeature1.getPoleType()}</li>`)
		  .append(`<li><strong>Franchisee: </strong>${poleFeature1.getFranchisee()}</li>`)
		  .append(`<li><strong>Franchise Contract Zone: </strong>${poleFeature1.getZone()}</li>`)
      .append(`<li><strong>Reservation Date: </strong>${poleFeature1.reservationDate()}</li>`)
    })
    afterEach(() => {
      poleFeature1.set('park_advisory', 'park_advisory')
      poleFeature1.set('historic_advisory', 'historic_advisory')
      poleFeature1.set('scenic_landmark_advisory', 'scenic_landmark_advisory')
      poleFeature1.set('bid_advisory', 'bid_advisory')
      poleFeature1.set('school_advisory', 'school_advisory')
      poleFeature1.set('status', 'Proposed')
    })

    test('detailsHtml', () => {
      expect.assertions(1)
      expect(poleFeature1.detailsHtml()).toEqual($('<div></div>').append(ul.append('<li><strong>Construction Status: </strong>Proposed</li>')
      .append($(`<li><strong>Additional Notes: </strong></li>`).append(poleFeature1.getAdvisories()))))
    })
    test('detailsHtml - no advisories/construction', () => {
      expect.assertions(1)
        
      poleFeature1.set('status', 'Approved')
      poleFeature1.set('park_advisory', '')
      poleFeature1.set('historic_advisory', '')
      poleFeature1.set('scenic_landmark_advisory', '')
      poleFeature1.set('bid_advisory', '')
      poleFeature1.set('school_advisory', '')
  
      expect(poleFeature1.detailsHtml()).toEqual($('<div></div>').append(ul.append('<li><strong>Construction Status: </strong>Approved</li>')))
  
    })
  })
 
  test('getStatus', () => {
    expect.assertions(3)
    expect(Object.assign(new Feature({'status': 'Proposed'}), decorations.pole).getStatus()).toBe('Proposed')
    expect(Object.assign(new Feature({'status': 'Installed'}), decorations.pole).getStatus()).toBe('Installed')
    expect(Object.assign(new Feature({'status': 'Approved'}), decorations.pole).getStatus()).toBe('Approved')
    
  })
  test('getAdvisories', () => {
    expect.assertions(1)
    let ul = $('<ul class="adv"></ul>')
    const messages = {
			park_advisory: 'Pole is located within park_advisory under the jurisdiction of the Department of Parks and Recreation.',
			historic_advisory: 'Pole is located near or within the historic_advisory under the jurisdiction of the Landmarks Preservation Commission.',
			scenic_landmark_advisory: 'Pole is located adjacent to scenic_landmark_advisory scenic landmark under the jurisdiction of the Landmarks Preservation Commission.',
			bid_advisory: 'Pole is located within Business Improvement District bid_advisory.',
			school_advisory: 'Pole is located within 20 feet of school_advisory.'
    }
    for(const msg in messages) {
      ul.append(`<li>${messages[msg]}</li>`)
    }
    expect(poleFeature1.getAdvisories()).toEqual(ul)
  })
})

