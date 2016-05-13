import schema     from 'js-schema';

const coopSchema = schema({
  'name'      : String ,
  'orgId'     : String ,
  '?members'  : [String]
});

export default coopSchema;
