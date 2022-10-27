# Vanilla JavaScript Paginator Component
A basic and bare-bones, vanilla JavaScript Paginator component that utilizes Bootstrap 5 style classes.

## Styles
The `_paginator.scss` file is a SCSS file you can import in your main SCSS styles if you use SCSS. Otherwise, you'll need to copy the style contents of that file and integrate it into your default CSS.

## Usage
Import the class, initialize an instance using a containing element, and setup event hooks. Each event connected in the example below will provide the integer `newPage` parameter that you can use for your pagination logic.

The paginator will handle invalid pages (out of bounds page numbers) for the buttons and the user-input form field. You can use the setCurrentPage and setMaxPage methods to define these boundaries.

```html
<div id="paginator-container"></div>
```

```js
import Paginator from "../../js-global/paginator/Paginator.js";

const element = document.querySelector("#paginator-container");
const paginator = new Paginator(element);
paginator.setMaxPages(3);

paginator.onNextButtonClicked(newPage => {
	// Some logic
});

paginator.onPrevButtonClicked(newPage => {
	// Some logic
});

paginator.onPageNumberFormSubmitted(newPage => {
	// Some logic
});
```

## Default Appearance
![image](https://user-images.githubusercontent.com/17110935/198338653-535c41ec-f1ee-4ab1-975b-73647343b78d.png)
