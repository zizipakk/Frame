using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace FrameHelper
{
    class DBContextHelper<TTEntity> : DbContext
    {
        public virtual IQueryable<TEntity> Query(Expression<Func<TEntity, bool>> predicate, Expression<Func<TEntity, bool>> order = null, int? page = null, int? size = null)
        {
            return GetAll().Where(predicate);
        }

        public virtual IQueryable<TEntity> GetAll()
        {
            return Set<TEntity>()
        }

        //Todo usercontext and methods for my entities
    }    
}
