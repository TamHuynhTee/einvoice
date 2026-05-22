enum INVOICE {
  CREATE = 'invoice.create',
  GET_BY_ID = 'invoice.get_by_id',
  UPDATE_BY_ID = 'invoice.update_by_id',
  DELETE_BY_ID = 'invoice.delete_by_id',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_ALL = 'product.get_all',
  GET_BY_ID = 'product.get_by_id',
  UPDATE_BY_ID = 'product.update_by_id',
  DELETE_BY_ID = 'product.delete_by_id',
  EXISTS = 'product.exists',
}

enum ROLE {
  GET_ALL = 'role.get_all',
  GET_BY_ID = 'role.get_by_id',
  GET_BY_NAME = 'role.get_by_name',
}

enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.get_all',
  GET_BY_USER_ID = 'user.get_by_user_id',
}

enum KEYCLOAK {
  CREATE_USER = 'keycloak.create_user',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
  ROLE,
  USER,
  KEYCLOAK,
};
