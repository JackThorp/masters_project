import schema     from 'js-schema';

const coopSchema = schema({
  'name'      : String ,
  'orgId'     : String ,
  'ipfsHash'  : String ,
  'address'   : String ,
  '?members'  : [String]
});

export default coopSchema;
