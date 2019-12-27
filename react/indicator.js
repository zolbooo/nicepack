function useFastReloadIndicator() {
  if (process.env.NODE_ENV === 'production') return;
  let hideTimeout = null;

  const styles = document.createElement('style');
  styles.innerHTML = `.fastReloadIndicator--Container {
    bottom: 0;
    width: 100%;
    height: 80px;
    display: flex;
    z-index: 99999;
    position: absolute;
    align-items: center;
    justify-content: center;
    background-color: #00000040;
  
    overflow-y: hidden;
    max-height: 80px;
  
    transition-property: all;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0, 1, 0.5, 1);

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .fastReloadIndicator--Container__hide {
    max-height: 0;
  }
  
  .fastReloadIndicator--StatusText {
    color: white;
    font-size: 1.3rem;
  }`;
  document.body.appendChild(styles);

  const Container = document.createElement('div');
  Container.className =
    'fastReloadIndicator--Container fastReloadIndicator--Container__hide';

  const Status = document.createElement('span');
  Status.className = 'fastReloadIndicator--StatusText';
  Container.appendChild(Status);

  module.hot.addStatusHandler(status => {
    switch (status) {
      case 'prepare':
        clearTimeout(hideTimeout);
        Container.classList.add('fastReloadIndicator--Container__hide');
        Container.classList.remove('fastReloadIndicator--Container__hide');
        Status.innerText = 'Refreshing using Fast Reload...';
        break;
      case 'idle':
        hideTimeout = setTimeout(() => {
          Container.classList.add('fastReloadIndicator--Container__hide');
        }, 1500);
        Status.innerText =
          "Reloaded. If you don't see any changes, reload page";
        break;
    }
  });

  document.body.appendChild(Container);
}

export default useFastReloadIndicator;
