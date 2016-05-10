import schema     from 'js-schema';

const addressSchema = schema({
  line1: String,
  line2: String,
  city: String,
  postcode: String,
  country: String
});

const userSchema = schema({
   'name'     : String,
   '?email'    : String,
   '?address'  : addressSchema
});

export default userSchema;
