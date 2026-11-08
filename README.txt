# Tale of Dreamers — Digital Card Collection

A small, editable HTML/CSS/JavaScript website for Windows.

## Files

- `index.html` — page structure
- `style.css` — visual design, responsive layout and 3D card effects
- `script.js` — character data, filters, favorites and interactions
- `images/` — place your character artwork here

## Run locally on Windows

1. Install Visual Studio Code: https://code.visualstudio.com/
2. Extract this project folder.
3. In VS Code, choose **File → Open Folder...** and select `Tale-of-Dreamers`.
4. Open `index.html`.
5. Either double-click `index.html` in File Explorer to open it in your browser, or install the **Live Server** extension in VS Code, right-click `index.html`, and choose **Open with Live Server**.

No build tools, Node.js, or database are required for this first version.

## Add the real character illustrations

The project includes individual character artwork in the images folder. The cards load these local image files automatically.

To replace a character image:
1. Replace the matching image in the `images` folder, keeping the same filename (for example `images/yuto.jpg`).
2. Alternatively, update the `image` property in the matching character object in `script.js`.
3. In `createCard()`, inside the `.card-art` element, insert an image element when `character.image` exists. For example:

```js
if (character.image) {
  const image = document.createElement("img");
  image.src = character.image;
  image.alt = `${character.name} character artwork`;
  front.querySelector(".card-art").prepend(image);
}
```

For best results, use portrait artwork with the character centered and enough background around them.

## Customize the collection

Edit the `characters` array near the top of `script.js` to add names, card numbers, titles, rarity, colors and descriptions. For a new character, also add a matching CSS background class in `style.css` and a filter button in `index.html` if you want a dedicated filter.

Favorites are saved in the browser's localStorage on the same device/browser.
