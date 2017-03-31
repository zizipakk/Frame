
namespace FrameSearch.ElasticSearchProvider
{
    public interface IEntityWithId<TId>
    {
        TId Id { get; set; }
    }
}
