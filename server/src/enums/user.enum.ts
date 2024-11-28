export enum ACCOUNT_TYPE {
  PERSONAL = 'personal',
  BUSINESS = 'business'
}
export enum USER_VERIFY_STATUS {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  BLOCKED = 'locked', // khóa tài khoản
  //yêu cầu khóa tài khoản
  REQUEST_LOCK = 'request_lock',
  REQUEST_UNLOCK = 'request_unlock'
}
export enum ROLE_TYPE {
  ADMIN = 'admin',
  USER = 'user'
}
