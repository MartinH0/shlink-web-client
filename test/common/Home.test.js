import { shallow } from 'enzyme';
import { values } from 'ramda';
import React from 'react';
import Home from '../../src/common/Home';

describe('<Home />', () => {
  let wrapped;
  const defaultProps = {
    resetSelectedServer: () => '',
    servers: { loading: false, list: {} },
  };
  const createComponent = (props) => {
    const actualProps = { ...defaultProps, ...props };

    wrapped = shallow(<Home {...actualProps} />);

    return wrapped;
  };

  afterEach(() => {
    if (wrapped !== undefined) {
      wrapped.unmount();
      wrapped = undefined;
    }
  });

  it('resets selected server when mounted', () => {
    const resetSelectedServer = jest.fn();

    expect(resetSelectedServer).not.toHaveBeenCalled();
    createComponent({ resetSelectedServer });
    expect(resetSelectedServer).toHaveBeenCalled();
  });

  it('shows link to create server when no servers exist', () => {
    const wrapped = createComponent();

    expect(wrapped.find('Link')).toHaveLength(1);
    expect(wrapped.find('ListGroup')).toHaveLength(0);
  });

  it('shows message when loading servers', () => {
    const wrapped = createComponent({ servers: { loading: true } });
    const span = wrapped.find('span');

    expect(span).toHaveLength(1);
    expect(span.text()).toContain('Trying to load servers...');
    expect(wrapped.find('ListGroup')).toHaveLength(0);
  });

  it('shows servers list when list of servers is not empty', () => {
    const servers = {
      loading: false,
      list: {
        1: { name: 'foo', id: '123' },
        2: { name: 'bar', id: '456' },
      },
    };
    const wrapped = createComponent({ servers });

    expect(wrapped.find('Link')).toHaveLength(0);
    expect(wrapped.find('ListGroup')).toHaveLength(1);
    expect(wrapped.find('ListGroupItem')).toHaveLength(values(servers).length);
  });
});
