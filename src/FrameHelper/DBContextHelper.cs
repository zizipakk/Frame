using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace FrameHelper
{
    /// <summary>
    /// This for common usage of extension methods
    /// </summary>
    internal interface ICommonContextHelper
    {
        IQueryable<TEntity> Query<TEntity>(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includes = "",
            int? page = null,
            int? size = null) where TEntity : class;

        IQueryable<TEntity> GetAll<TEntity>() where TEntity : class;

        //Todo usercontext and methods for my entities
    }

    /// <summary>
    /// This for common usage of extension methods
    /// </summary>
    internal sealed class CommonContextHelper : ICommonContextHelper
    {
        private readonly DbContext context;

        public CommonContextHelper(DbContext context)
        {
            this.context = context;
        }

        public IQueryable<TEntity> Query<TEntity>(
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

        public IQueryable<TEntity> GetAll<TEntity>() where TEntity : class
        {
            return context.Set<TEntity>(); // we used only this one, fromDBContext instance
        }
    }

    /// <summary>
    /// Method extensions for DBContext
    /// </summary>
    public class DBContextHelper : DbContext
    {
        private readonly ICommonContextHelper common;

        public DBContextHelper(DbContextOptions options)
            : base(options)
        {
            common = new CommonContextHelper(this);
        }

        public virtual IQueryable<TEntity> Query<TEntity>(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includes = "", 
            int? page = null, 
            int? size = null) where TEntity : class
        {
            return common.Query(filter, orderBy, includes, page, size);            
        }

        public virtual IQueryable<TEntity> GetAll<TEntity>() where TEntity : class
        {
            return common.GetAll<TEntity>();
        }
    }

    /// <summary>
    /// Method extensions for IdentityDbContext
    /// </summary>
    public class DBContextWithIdentityHelper<TUser> : IdentityDbContext<TUser> where TUser : IdentityUser
    {
        private readonly ICommonContextHelper common;

        public DBContextWithIdentityHelper(DbContextOptions options)
            : base(options)
        {
            common = new CommonContextHelper(this);
        }

        public virtual IQueryable<TEntity> Query<TEntity>(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includes = "",
            int? page = null,
            int? size = null) where TEntity : class
        {
            return common.Query(filter, orderBy, includes, page, size);
        }

        public virtual IQueryable<TEntity> GetAll<TEntity>() where TEntity : class
        {
            return common.GetAll<TEntity>();
        }
    }    
}
