/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
// The Listly Safari extension (DD-46): fills Poshmark, Mercari and Facebook Marketplace sell pages in the
// seller's own Safari. Icons in assets/images are placeholders until the Listly icon exists.
module.exports = (config) => ({
  type: 'safari',
  name: 'ListlySafari',
  displayName: 'Listly',
  entitlements: {},
})
