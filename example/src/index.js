import fm from './something.md'

function component() {
  const element = document.createElement('div');
  element.innerHTML = fm.html
  return element;
}

document.body.appendChild(component());
