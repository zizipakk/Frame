using System.Collections.Generic;

namespace FrameSearch.ElasticSearchProvider
{
    public interface ISearchResult<TEntity>
    {
        IEnumerable<TEntity> Entities { get; set; }

        long Hits { get; set; }

        long Took { get; set; }
    }

    public class SearchResult<TEntity>
    {
        public IEnumerable<TEntity> Entities { get; set; }

        public long Hits { get; set; }

        public long Took { get; set; }
    }
}
