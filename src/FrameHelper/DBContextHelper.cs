using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace FrameHelper
{
    /// <summary>
    /// Interface for filter query
    /// </summary>
    public interface IFilterModel<TEntity> where TEntity : class
    {
        Expression<Func<TEntity, bool>> Filter { get; set; }
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> OrderBy { get; set; }
        string Includes { get; set; }
        int? Page { get; set; }
        int? Size { get; set; }
    }

    /// <summary>
    /// Model class for filter query
    /// </summary>
    public class FilterModel<TEntity> : IFilterModel<TEntity> where TEntity : class
    {
        public Expression<Func<TEntity, bool>> Filter { get; set; }
        public Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> OrderBy { get; set; }
        public string Includes { get; set; }
        public int? Page { get; set; }
        public int? Size { get; set; }
    }

    /// <summary>
    /// This for common usage of extension methods
    /// </summary>
    internal interface ICommonContextHelper
    {
        IQueryable<TEntity> Query<TEntity>(IFilterModel<TEntity>) where TEntity : class;

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

        public IQueryable<TEntity> Query<TEntity>(IFilterModel<TEntity> filter) where TEntity : class
        {
            var query = GetAll<TEntity>();

            if (filter?.Filter != null)
                query = query.Where(filter.Filter);

            if (filter?.Includes != null)
                filter.Includes.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                    .ToList()
                    .ForEach(include => query = query.Include(include));

            if (filter?.OrderBy != null)
                query = filter.OrderBy(query);

            if (filter?.Page != null && filter?.Size != null)
                query = query.Skip((int)filter.Page * (int)filter.Size);

            if (filter?.Size != null)
                query = query.Take((int)filter.Size);

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

        public virtual IQueryable<TEntity> Query<TEntity>(IFilterModel<TEntity> filter) where TEntity : class
        {
            return common.Query(filter);            
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

        public virtual IQueryable<TEntity> Query<TEntity>(IFilterModel<TEntity> filter) where TEntity : class
        {
            return common.Query(filter);
        }

        public virtual IQueryable<TEntity> GetAll<TEntity>() where TEntity : class
        {
            return common.GetAll<TEntity>();
        }
    }    
}
