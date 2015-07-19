# Aerialist
Open source ZDF reader built on Electron

This project is developed alongside the ZDF specification. It is in no way ready for production. 1.0 will be the first production ready version and will be released after the finalized ZDF specification.

# Usage
Requirements:
* Node.js
* Grunt

To run Aerialist:

1. Clone the repository locally
1. Clone `node-zdf` locally (for the moment, Aerialist uses the local version. This will be a dependency in the future)
1. Run `npm install` from the root directory to pull dependencies
1. Run `grunt` from the root directory to start the application

The application will first prompt for a ZDF file to open. Next, it will begin opening the file and **attempting** to display its contents. The display is still a work in progress.

Obviously, Aerialist is in its early stages of development. As the specification is finalized and more development time is available, Aerialist will include a full GUI interface capable of listing recently opened documents, bookmarking, toggling between available pages sizes, printing, verifying signature/decrypting, and much more.

# Contributing
The ZDF project as a whole needs your support. If you're interested in working on Aerialist or any of the other pieces of the project, email [rtbenfield@gmail.com](mailto:rtbenfield@gmail.com).

This project is in need of developers experienced in manipulating HTML for rendering in a customized way. To be specific, the contents of the document need to be parsed and rendered in individual pages (ex. 8 1/2" x 11"). The challenge to this is detecting the best page break location and trimming the HTML appropriately to carryover to a new page.