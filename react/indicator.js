function useFastReloadIndicator() {
  if (process.env.NODE_ENV === 'production') return;
  let hideTimeout = null;

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
        Status.innerText = 'Fast Reload is working...';
        break;
      case 'idle':
        hideTimeout = setTimeout(() => {
          Container.classList.add('fastReloadIndicator--Container__hide');
        }, 1500);
        Status.innerText =
          "Fast Reload refreshed page. If this didn't work, reload page";
        break;
    }
  });

  document.body.appendChild(Container);
}

export default useFastReloadIndicator;
