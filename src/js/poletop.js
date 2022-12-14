/**
 * @module poletop-finder/poletop
 */

/**
* @desc Constants
* @public
* @const {Object<string, string>}
*/
const poletop = {
  CLUSTER_RADIUS_DENOMINATOR: 11,
  CLUSTER_CUTOFF_ZOOM: 14,
  GEOCLIENT_URL: 'https://maps.nyc.gov/geoclient/v2/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  POLE_DATA_URL: 'https://data.cityofnewyork.us/resource/tbgj-tdd6.csv?&$limit=50000',
  GROUPED_DATA_URL: 'https://data.cityofnewyork.us/resource/tbgj-tdd6.csv?$select=community_board,count(community_board)%20as%20count&$group=community_board&$limit=50000',
	COMMUNITY_BOARD_URL: 'data/community-board.csv',
	SPLASH_MESSAGE: '<p>This map includes locations of street light poles, traffic light poles, and utility poles that are approved for installation of mobile telecommunications equipment by companies authorized by the New York City Department of Information Technology and Telecommunications (DoITT). Today, these poletop locations are used to provide 4G across NYC and in the future may include additional pole-mounted equipment to support 5G.</p><p>For more information on DoITT\'s Franchise agreements and poletop reservation process with mobile telecommunication companies, please visit DoITT\'s <a href ="https://www1.nyc.gov/site/doitt/business/mobile-telecom-franchises.page">website</a>.</p><p>Data published in this map is updated regularly and is available for download on <a href= "https://data.cityofnewyork.us/City-Government/Mobile-Telecommunication-Franchise-Poletop-Install/tbgj-tdd6">NYC OpenData</a>.</p>'
}
window.CLUSTER_RADIUS_DENOMINATOR = 11
export default poletop