export function imagePathForCardBrand(brand) {
    switch(brand) {
        case 'American Express':
          return '/cards/americanexpress.png';
        case 'Diners Club':
          return '/cards/dinersclub.png';
        case 'Discover':
          return '/cards/discover.png';
        case 'JCB':
          return '/cards/jcb.png';
        case 'MasterCard':
          return '/cards/mastercard.png';
        case 'UnionPay':
          return '/cards/unionpay.png';
        case 'Visa':
          return '/cards/visa.png';
        default:
            return null;
    }
}
