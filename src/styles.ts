export const styles = `
body {
  background-color: white;
  color: black;
}

* {
  font-family: monospace;
  font-size: 12px;
}

.container {
  width: 100%;
  overflow-x: auto;
  contain: content;
  will-change: transform;
}

table {
  border-collapse: collapse;
  white-space: nowrap;
  width: 100%;
  contain: content;
}

table,
td,
th {
  border: 1px solid gray;
}

td,
th {
  padding: 2px 5px;
  text-align: left;
}

th {
  font-weight: bold;
  background-color: #f2f2f2;
  vertical-align: top;
}

.blue-wrapper {
  border-top: 1px solid #4a6da7;
  margin-bottom: 10px;
  width: fit-content;
  position: relative;
}

.blue-header {
  background-color: #4a6da7;
  height: 1.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 5px;
  color: white;
  gap: 5px;
  transition: background-color 0.2s ease;
}

.blue-header:hover {
  background-color: #5a7db7;
}

.blue-header:active {
  background-color: #3a5d97;
}

.blue-wrapper.collapsed>.content {
  display: none;
}

.toggle-indicator {
  display: inline-block;
  width: 1em;
  text-align: center;
  transition: transform 0.2s;
}

.blue-wrapper.collapsed>.blue-header .toggle-indicator {
  transform: rotate(-90deg);
}

.item-count {
  margin-left: auto;
}

.blue-wrapper:not(.collapsed)>.blue-header .item-count {
  display: none;
}

.blue-wrapper>.content {
  display: block;
  contain: content;
  transform: translateZ(0);
}

.number-cell {
  color: #0066cc;
  font-family: 'Consolas', 'Monaco', monospace;
}

.number-string-cell {
  color: #006600;
  font-family: 'Consolas', 'Monaco', monospace;
}

.string-cell {
  color: #333;
}

.date-cell {
  color: #008000;
  font-style: italic;
}

.null-cell {
  color: #999;
  font-style: italic;
}

.slider-container {
  /* margin-bottom: 20px; */
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-container input {
  width: 200px;
}

.blue-header {
  justify-content: flex-start;
}

.copy-button {
  margin-left: auto;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.blue-header:hover .copy-button {
  opacity: 1;
}

.copy-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.copy-button:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.array-table {
  width: auto;
  margin-left: auto;
}

td .array-table {
  margin-right: 0;
}

.boolean-cell {
  text-align: center;
}

.boolean-cell svg {
  vertical-align: middle;
}

.undefined-cell {
  color: #999;
  font-style: italic;
}

.nan-cell {
  color: #ff4500;
  font-style: italic;
}

.empty-array {
  color: #999;
  font-style: italic;
  padding: 2px 5px;
}

.empty-string {
  color: #999;
  padding: 2px 4px;
  border-radius: 3px;
}

.string-cell a {
  color: #0000ee;
  text-decoration: underline;
}

.string-cell a:visited {
  color: #551a8b;
}

.string-cell a:hover {
  text-decoration: none;
}

.plain-string {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  white-space: pre-wrap;
  word-break: break-word;
}

.plain-date {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f0fff0;
  color: #008000;
  font-style: italic;
}

.controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.view-toggle {
  display: flex;
  align-items: center;
}

.view-toggle label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.raw-json {
  /* background: #f5f5f5; */
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
  max-height: fit-content;
  white-space: pre-wrap;
  font-family: monospace;
  contain: content;
}

.fold-level-indicator {
  background-color: #f2f2f2;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  color: #666;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fold-level-indicator .selected-path {
  color: #4a6da7;
  font-weight: bold;
}

.fullscreen-button {
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
  padding: 0 5px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.blue-header:hover .fullscreen-button {
  opacity: 1;
}

.fullscreen-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.fullscreen-button:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.blue-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  margin: 0;
  background: white;
  width: 100vw;
  min-height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  border: none;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.blue-wrapper.fullscreen > .blue-header {
  border-radius: 0;
  padding: 10px;
  height: auto;
}

.blue-wrapper.fullscreen > .content {
  flex: 0 1 auto;
  overflow: auto;
  padding: 10px;
  margin: 0;
  background: #fff;
  display: flex;
  justify-content: flex-start;
}

.blue-wrapper.fullscreen .data-table {
  width: fit-content;
  height: fit-content;
  border-collapse: collapse;
  margin: 0;
}

.blue-wrapper.fullscreen .data-table th,
.blue-wrapper.fullscreen .data-table td {
  padding: 2px 5px;
}

.data-table {
  border-collapse: collapse;
  white-space: nowrap;
  width: 100%;
  contain: content;
}

.blue-wrapper.selected {
  outline: 2px solid #4a6da7;
  outline-offset: 1px;
}

.blue-wrapper.selected > .blue-header {
  background-color: #5a7db7;
}

.blue-wrapper.selected > .blue-header:hover {
  background-color: #6a8dc7;
}

.data-table tr.selected {
  background-color: #e8f0ff;
  outline: 2px solid #4a6da7;
  outline-offset: -2px;
}

.data-table tr.selected td,
.data-table tr.selected th {
  background-color: #e8f0ff;
}

.array-table tr.selected td {
  background-color: #e8f0ff;
  outline: 2px solid #4a6da7;
  outline-offset: -2px;
}

`