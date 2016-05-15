import schema     from 'js-schema';

const coopSchema = schema({
  'name'      : String ,
  'orgId'     : String ,
  '?terms'    : String ,
  '?fee'      : Number ,
  '?members'  : [String]
});

export default coopSchema;
