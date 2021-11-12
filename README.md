# Crawler

A very simple crawler which takes a website URL and maps all links.

## Usage

1. Clone this repository
2. Run `npm install`
3. Run `npm run scan <url>`

Results are saved to in the `data` folder.

## Modify

### Exclude certain file types

You can exclude certain file types by adding the type extension to `excludeList.js`.

### Other modifications

This crawler uses [simplecrawler](https://github.com/simplecrawler/simplecrawler) under the hood. You can modify the `index.js` file with any other simplecrawler configuration options you wish.