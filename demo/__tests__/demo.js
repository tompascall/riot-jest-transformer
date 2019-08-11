import * as riot from 'riot';
import hello from '../hello.tag';

function setAttributes(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

describe('hello', () => {
  beforeAll( () => {
      // create mounting point
      const elem = document.createElement('hello');

      setAttributes(elem, {
        name: 'world'
      });

      document.body.appendChild(elem)

      riot.register('hello', hello);
      riot.mount(elem, 'hello');
  });

  it('should mount the tag', () => {
      expect(document.querySelector('hello h1').textContent).toBe('world');
  });
});
