using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrameSearch.ElasticSearchProvider
{
    public interface IEntitySearchProvider<TEntity, TDTO, TId>
    {
        void CreateIndex();

        void AddOrUpdateData(IEnumerable<TEntity> data);

        IEnumerable<string> AutocompleteSearch(string term);

        SearchResult<TEntity> Search(string term, int from);

        bool GetStatus();

        IEnumerable<TEntity> QueryString(string term);
    }
}
