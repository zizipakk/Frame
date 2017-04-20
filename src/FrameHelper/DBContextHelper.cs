using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace FrameHelper
{
    class DBContextHelper : DbContext
    {
        public virtual IQueryable<TEntity> Query<TEntity>(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includes = "", 
            int? page = null, 
            int? size = null) where TEntity : class
        {
            var query = GetAll<TEntity>();

            if (filter != null)
                query = query.Where(filter);

            if (includes != null)
                includes.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                    .ToList()
                    .ForEach(include => query = query.Include(include));

            if (orderBy != null)
                query = orderBy(query);

            if (page != null && size != null)
                query = query.Skip((int)page * (int)size);

            if (size != null)
                query = query.Take((int)size);

            return query;            
        }

        public virtual IQueryable<TEntity> GetAll<TEntity>() where TEntity : class
        {
            return Set<TEntity>();
        }

        //Todo usercontext and methods for my entities
    }    
}
