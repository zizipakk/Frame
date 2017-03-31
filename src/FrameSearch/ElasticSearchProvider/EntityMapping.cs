using ElasticsearchCRUD;
using System;

namespace FrameSearch.ElasticSearchProvider
{
    public interface IEntityMapping
    {
        string GetIndexForType(Type type);

        string GetDocumentType(Type type);
    }

    public class EntityMapping<TEntity> : ElasticsearchMapping, IEntityMapping
    {
        public override string GetIndexForType(Type type)
        {
            return $"{nameof(TEntity)}s";
        }

        public override string GetDocumentType(Type type)
        {
            return nameof(TEntity);
        }
    }
}
