import fm from './something.md'

const html = () => {
  const element = document.createElement('div');
  element.innerHTML = fm.html
  return element;
}

const attributes = () => {
  const attributes = document.createElement('pre');
  attributes.innerText = JSON.stringify(fm.attributes);
  return attributes;
}

document.body.appendChild(html());
document.body.appendChild(attributes());
