import {poleFeature1, cbFeature} from './test-features'
import facilityStyle from '../src/js/facility-style'
import Circle from 'ol/style/Circle'
import Icon from 'ol/style/Icon'
import Fill from 'ol/style/Fill'
import Text from 'ol/style/Text'

test('style - pole, feature not installed', () => {
  expect.assertions(4)
  poleFeature1.set('status', 'Proposed')

  const style = facilityStyle.style(poleFeature1, 305.748113140705)
  expect(style[0].getImage() instanceof Circle).toBe(true)
  expect(style[0].getImage().getStroke().getColor()).toBe('#fff')
  expect(style[0].getImage().getFill().getColor()).toBe('rgba(46,107,164,.7)')
  expect(style.length).toBe(1)
})
test('style - pole, feature approved', () => {
  expect.assertions(5)
  poleFeature1.set('status', 'Approved')

  const style = facilityStyle.style(poleFeature1, 305.748113140705)
  expect(style[1].getImage() instanceof Icon).toBe(true)
  expect(style[1].getImage().getSrc()).toBe('img/check_mark.svg')
  expect(style[1].getImage().getImageSize()).toEqual([270, 270])
  expect(style[1].getImage().getScale()).toBe(0.03888888888888889)
  expect(style.length).toBe(2)
})
test('style - pole, feature installed', () => {
  expect.assertions(5)
  poleFeature1.set('status', 'Installed')

  const style = facilityStyle.style(poleFeature1, 305.748113140705)
  expect(style[1].getImage() instanceof Icon).toBe(true)
  expect(style[1].getImage().getSrc()).toBe('img/signal.svg')
  expect(style[1].getImage().getImageSize()).toEqual([512, 512])
  expect(style[1].getImage().getScale()).toBe(0.0205078125)
  expect(style.length).toBe(2)
})
test('style - community board', () => {
  expect.assertions(6)

  const style = facilityStyle.style(cbFeature, 305.748113140705)

  expect(style[0].getText() instanceof Text).toBe(true)
  expect(style[0].getText().getText()).toBe('100')
  expect(style[0].getText().getFill() instanceof Fill).toBe(true)
  expect(style[0].getText().getFill().getColor()).toBe('#fff')
  expect(style[0].getText().getFont()).toBe('bold 9px sans-serif')

  expect(style.length).toBe(1)
})

test('highlightStyle', () => {
  expect.assertions(4)

  const style = facilityStyle.highLightStyle(poleFeature1, 305.748113140705)
  expect(style.getImage() instanceof Circle).toBe(true)
  expect(style.getImage().getStroke().getColor()).toBe('#F8951D')
  expect(style.getImage().getStroke().getWidth()).toBe(5)
  expect(style.getImage().getRadius()).toBe(9)
})

test('getRadius - community board', () => {
  expect.assertions(2)
  const getCount = cbFeature.getCount
  cbFeature.getCount = jest.fn().mockImplementation(() => {
    return 100
  })
  expect(facilityStyle.getRadius(cbFeature, 19.109257071294063)).toBe(9.090909090909092)
  cbFeature.getCount = jest.fn().mockImplementation(() => {
    return 75
  })
  expect(facilityStyle.getRadius(cbFeature, 19.109257071294063)).toBe(7)

  cbFeature.getCount = getCount
})

test('getRadius - pole', () => {
  expect.assertions(6)

  //zoom levels: 18, 17, 16, 15, 14
  expect(facilityStyle.getRadius(poleFeature1, 0.5971642834779395)).toBe(19)
  expect(facilityStyle.getRadius(poleFeature1, 1.194328566955879)).toBe(16)
  expect(facilityStyle.getRadius(poleFeature1, 2.388657133911758)).toBe(13)
  expect(facilityStyle.getRadius(poleFeature1, 4.777314267823516)).toBe(10)
  expect(facilityStyle.getRadius(poleFeature1, 9.554628535647032)).toBe(7)
  //zoom < CLUSTER_CUTOFF_ZOOM
  expect(facilityStyle.getRadius(poleFeature1, 19.109257071294063)).toBe(7)
})
