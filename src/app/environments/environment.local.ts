export const environment = {
  name: 'dev',
  apiUrl: '',
  apbPaymentUrl: 'https://www.agroprombank.com/payments/PaymentStart',
  productImageUrl: 'https://storage.tiravto.com/image/tiravto-storage/images/',
  //productFileUrl: 'https://storage.tiravto.com/file/tiravto-storage/',
  storageUrl: 'https://storage.tiravto.com',
  storeImageUrl: '/images/stores/',
  categoryImageUrl: '/images/categories/',
  // noPhotoUrl: '/Content/Main/no-photo.jpg',
  // analogPhoto: '/Content/Main/analog_photo.jpg',
  // analogNoPhoto: '/Content/Main/analog_no_photo.jpg',
  noPhotoUrl: '/image/tiravto-storage/images/BE2CABE171354FB73E6734AD29ED0F8B',
  analogPhoto: '/image/tiravto-storage/images/BE2CABE171354FB73E6734AD29ED0F8B',
  analogNoPhoto: '/image/tiravto-storage/images/BE2CABE171354FB73E6734AD29ED0F8B',
  sliderMain: '/Content/mainSlider/',
  partners: '/images/partners/',
  blogMain: '/images/articles/',
  infoMain: '/images/downloadInfo/',
  infoItemMain: '/images/downloadInfoItem/',
  infoItemFileMain: '/Content/DownloadInfoItem/File/',
  socialPath: '/Content/Main/',
  orderOk: '/image/tiravto-storage/images/order-ok.jpg',
  notifyUrl: '/notifier',
  categoryMain: '/catalog',
  production: false,
  storageProduct: 'Basket',
  blogCount: 8,
  countZero: 'Нет в наличии',
  countMin: 'Остаток меньше кол-ва в корзине',
  tireCalculator: 'tirecalculatorsliderdown',
  baseConfigurationSetting: {
    small: 16,
    typeSet: 32,
    titleName: 64,
    large: 128
  },
  roles: {
    customer: 'Customer',
    manager: 'Manager',
    admin: 'Admin',
  },
  currency: {
    PRB: {
      title: 'Приднестровский рубль',
      symbol: 'руб.',
      code: 'PRB'
    },
    USD: {
      title: 'Доллар США',
      symbol: '$',
      code: 'USD'
    },
  },
  delivery: {
    sam: 'CustomerPickup',
    courier: 'Courier'
  },
  selectOrderByStart: 0,
  takeCount: 20,
  selectOrderBy: [{
      stringKey: 'ByAvailability',
      id: 0,
      title: 'По наличию',
    },
    {
      stringKey: 'ToExpensive',
      id: 1,
      title: 'От дешёвых к дорогим',
    },
    {
      stringKey: 'FromExpensive',
      id: 2,
      title: 'От дорогих к дешёвым',
    },
    {
      stringKey: 'ByTitleAz',
      id: 3,
      title: 'По наименованию А-я',
    },
    {
      stringKey: 'ByTitleZa',
      id: 4,
      title: 'По наименованию Я-а',
    },
    {
      stringKey: 'ByBrandAz',
      id: 5,
      title: 'По производителю A-z',
    },
    {
      stringKey: 'ByBrandZa',
      id: 6,
      title: 'По производителю Z-a',
    }
  ],
  menuSliderIcon: [{
      stringKey: 'tecdocsliderdown',
      content: '<span class="lnr lnr-car car-tecdoc-icon color-icon"></span>'
    },
    {
      stringKey: 'tirecalculatorsliderdown',
      content: '<span class="lnr lnr-chart-bars color-icon"></span>'
    },
    {
      stringKey: 'stosubssliderdown',
      content: '<span class="lnr lnr-pencil color-icon"></span>'
    }
  ],
  orderStatus: [
    {
        title: 'Заказан',
        id: 0,
        stringKey: 'Order'
    },
    {
        title: 'Зарезервирован',
        id: 1,
        stringKey: 'Reserved'
    },
    {
        title: 'Отправлен на упаковку',
        id: 2,
        stringKey: 'ToBox'
    },
    {
        title: 'Упаковывается',
        id: 3,
        stringKey: 'Box'
    },
    {
        title: 'Готов к выдаче',
        id: 4,
        stringKey: 'ReadyToGet'
    },
    {
        title: 'Выполнен',
        id: 5,
        stringKey: 'Complete'
    },
    {
        title: 'Снят с резерва',
        id: 6,
        stringKey: 'UnReserved'
    },
    {
        title: 'Ожидание перемещения',
        id: 7,
        stringKey: 'RouteWaiting'
    },
    {
        title: 'Перемещение выполнено',
        id: 8,
        stringKey: 'RouteComplete'
    },
    {
        title: 'В пути',
        id: 9,
        stringKey: 'RouteProgress'
    },
    {
        title: 'Ожидание прихода',
        id: 10,
        stringKey: 'Waiting'
    }
],
topLabelDefault: 'ХИТ',
newLabelDefault: 'НОВИНКА'
};
/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error'; // Included with Angular CLI.
