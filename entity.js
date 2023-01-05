import { whereFilter } from 'knex-filter-loopback'
import { celebrate, Joi, Segments } from 'celebrate'
import _ from 'underscore'

export function listItems (query, qb) {
  const currentPage = Number(query.currentPage) || null
  const perPage = Number(query.perPage) || 10
  const fields = query.fields ? query.fields.split(',') : null
  const sort = query.sort ? query.sort.split(':') : null
  const filter = query.filter || null
  
  qb = filter ? qb.where(whereFilter(filter)) : qb
  qb = fields ? qb.select(fields) : qb
  qb = sort ? qb.orderBy(sort[0], sort[1]) : qb
  return currentPage 
    ? qb.paginate({ perPage, currentPage, isLengthAware: true }) 
    : qb
}

export function createValidationMiddleware (schemaFn) {
  const schema = schemaFn(Segments, Joi)
  return celebrate(schema)
}