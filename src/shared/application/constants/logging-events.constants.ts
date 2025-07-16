export const API_EVENTS = {
  INCOMING_REQUEST: 'incoming_request',
  OUTGOING_REQUEST: 'outgoing_request',
  INVALID_BODY_REQUEST_ERROR: 'invalid_body_request_error',
  ERROR: 'error',
  MONGODB_ERROR: 'mongodb_error',
  UNIT_OF_WORK_TRANSACTION_ERROR: 'unit_of_worker_transaction_error',
  USER_LOGGED_IN: 'user_logged_in',
  FORBIDDEN_ROLES_NOT_FOUND: 'forbidden_roles_not_found',
  TRACING_SPAN_API_REQUEST_SUCCESS: 'tracing_span_api_request_success',
  TRACING_SPAN_API_REQUEST_ERROR: 'tracing_span_api_request_error',
  ELASTICSEARCH_CONNECTED: 'elasticsearch_connected',
  ELASTICSEARCH_RETRY_CONNECTION: 'elasticsearch_retry_connection',
  ELASTICSEARCH_CONNECTION_ERROR: 'elasticsearch_connection_error',
};

export const WEB_SOCKET_SERVER_EVENTS = {
  TRACING_SPAN_WS_SERVER_REQUEST_SUCCESS: 'tracing_span_ws_server_request_success',
  TRACING_SPAN_WS_SERVER_REQUEST_ERROR: 'tracing_span_ws_server_request_error',
};

export const CATEGORIZATION_ELASTIC_EVENTS = {
  CATEGORIZATION_CREATE_TRANSACTIONS: 'categorization_create_transactions',
  CATEGORIZATION_UPDATE_TRANSACTIONS: 'categorization_update_transactions',
  CATEGORIZATION_DELETE_TRANSACTIONS: 'categorization_delete_transactions',
  CATEGORIZATION_DELETE_CATEGORIES: 'categorization_delete_categories',
  CATEGORIZATION_ACTIVE_CATEGORIES: 'categorization_active_categories',
  CATEGORIZATION_DELETE_SUB_CATEGORIES: 'categorization_delete_sub_categories',
  CATEGORIZATION_ACTIVE_SUB_CATEGORIES: 'categorization_active_sub_categories',
};
