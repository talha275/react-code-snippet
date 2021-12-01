exports.errorName = {
    PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
    SERVER_ERROR: 'SERVER_ERROR'
  }
  
exports.errorType = {
  PASSWORD_MISMATCH: {
    message: 'Passwords doesn\'t match.',
    statusCode: 401
  },
  SERVER_ERROR: {
    message: 'Server error.',
    statusCode: 500
  }
}