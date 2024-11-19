import Home from './default';

describe('<Home />', () => {
  it('mounts', () => {
    cy.mount(<Home />);
  });
});
