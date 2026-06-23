const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
console.log(typeof FieldValue.vector === 'function' ? 'Vector supported' : 'Vector NOT supported');
