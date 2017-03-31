﻿using System.Collections.Generic;
using System.Linq;
using ElasticsearchCRUD;
using ElasticsearchCRUD.ContextAddDeleteUpdate.IndexModel.MappingModel;
using ElasticsearchCRUD.ContextAddDeleteUpdate.IndexModel.SettingsModel;
using ElasticsearchCRUD.ContextAddDeleteUpdate.IndexModel.SettingsModel.Analyzers;
using ElasticsearchCRUD.ContextAddDeleteUpdate.IndexModel.SettingsModel.Filters;
using ElasticsearchCRUD.ContextSearch.SearchModel.AggModel;
using ElasticsearchCRUD.Model;
using ElasticsearchCRUD.Model.SearchModel;
using ElasticsearchCRUD.Model.SearchModel.Aggregations;
using ElasticsearchCRUD.Model.SearchModel.Queries;
using ElasticsearchCRUD.Model.SearchModel.Sorting;
using ElasticsearchCRUD.Tracing;

namespace FrameSearch.ElasticSearchProvider
{
    public class EntitySearchProvider<TEntity, TDTO, TId> : IEntitySearchProvider<TEntity, TDTO, TId>
        where TEntity : IEntityWithId<TId>
    {
        private readonly IElasticsearchMappingResolver _elasticsearchMappingResolver = new ElasticsearchMappingResolver();
        private const string ConnectionString = "http://localhost:32771";
        private readonly ElasticsearchContext _context;

        public EntitySearchProvider()
        {
            _elasticsearchMappingResolver.AddElasticSearchMappingForEntityType(typeof(TDTO), new EntityMapping<TEntity>());
            _context = new ElasticsearchContext(ConnectionString, new ElasticsearchSerializerConfiguration(_elasticsearchMappingResolver))
            {
                TraceProvider = new ConsoleTraceProvider()
            };
        }

        public void CreateIndex()
        {
            _context.IndexCreate<TDTO>(CreateNewIndexDefinition());
        }

        public void CreateMapping()
        {
            _context.IndexCreateTypeMapping<TDTO>(new MappingDefinition() { });
        }

        private IndexDefinition CreateNewIndexDefinition()
        {
            return new IndexDefinition
            {
                IndexSettings =
                {
                    Analysis = new Analysis
                    {
                        Filters =
                        {
                            CustomFilters = new List<AnalysisFilterBase>
                            {
                                new StemmerTokenFilter("stemmer"),
                                new ShingleTokenFilter("autocompletefilter")
                                {
                                    MaxShingleSize = 5,
                                    MinShingleSize = 2
                                },
                                new StopTokenFilter("stopwords"),
                                new EdgeNGramTokenFilter("edge_ngram_filter")
                                {
                                    MaxGram = 20,
                                    MinGram = 2
                                }
                            }
                        },
                        Analyzer =
                        {
                            Analyzers = new List<AnalyzerBase>
                            {
                                new CustomAnalyzer("edge_ngram_search")
                                {
                                    Tokenizer = DefaultTokenizers.Standard,
                                    Filter = new List<string> {DefaultTokenFilters.Lowercase, "edge_ngram_filter"},
                                    CharFilter = new List<string> {DefaultCharFilters.HtmlStrip}
                                },
                                new CustomAnalyzer("autocomplete")
                                {
                                    Tokenizer = DefaultTokenizers.Standard,
                                    Filter = new List<string> {DefaultTokenFilters.Lowercase, "autocompletefilter", "stopwords", "stemmer"},
                                    CharFilter = new List<string> {DefaultCharFilters.HtmlStrip}
                                },
                                new CustomAnalyzer("default")
                                {
                                    Tokenizer = DefaultTokenizers.Standard,
                                    Filter = new List<string> {DefaultTokenFilters.Lowercase, "stopwords", "stemmer"},
                                    CharFilter = new List<string> {DefaultCharFilters.HtmlStrip}
                                }


                            }
                        }
                        //Tokenizers =
                        //{
                        //    CustomTokenizers = new List<AnalysisTokenizerBase>
                        //    {
                        //        new EdgeNGramTokenizer("ngram_tokenizer")
                        //        {
                        //            MaxGram = 4,
                        //            MinGram = 4
                        //        }
                        //    }
                        //}

                    }
                },
            };

        }

        public IEnumerable<string> AutocompleteSearch(string term)
        {
            var search = new Search
            {
                Size = 0,
                Aggs = new List<IAggs>
                {
                    new TermsBucketAggregation("autocomplete", "autocomplete")
                    {
                        Order= new OrderAgg("_count", OrderEnum.desc),
                        Include = new IncludeExpression(term + ".*")
                    }
                }
                //Query = new Query(new PrefixQuery("autocomplete", term))
            };

            var items = _context.Search<TEntity>(search);
            var aggResult = items.PayloadResult.Aggregations.GetComplexValue<TermsBucketAggregationsResult>("autocomplete");
            IEnumerable<string> results = aggResult.Buckets.Select(t => t.Key.ToString());
            return results;
        }

        public SearchResult<TEntity> Search(string term, int from)
        {
            var personCitySearchResult = new SearchResult<TEntity>();
            var search = new Search
            {
                Size = 10,
                From = from,
                Query = new Query(new MatchQuery("searchfield", term))
            };

            var results = _context.Search<TEntity>(search);

            personCitySearchResult.Entities = results.PayloadResult.Hits.HitsResult.Select(t => t.Source);
            personCitySearchResult.Hits = results.PayloadResult.Hits.Total;
            personCitySearchResult.Took = results.PayloadResult.Took;
            return personCitySearchResult;
        }

        public bool GetStatus()
        {
            return _context.IndexExists<TEntity>();
        }

        /// <summary>
        /// Used for basic auto complete
        /// </summary>
        /// <param name="term"></param>
        /// <returns></returns>
        public IEnumerable<TEntity> QueryString(string term)
        {
            var results = _context.Search<TEntity>(BuildQueryStringSearch(term));

            return results.PayloadResult.Hits.HitsResult.Select(t => t.Source);
        }

        public void AddOrUpdateData(IEnumerable<TEntity> data)
        {
            foreach (var item in data)
            {
                _context.AddUpdateDocument(item, item.Id);
            }

            _context.SaveChanges();
        }

        /// <summary>
        /// TODO protect against injection!
        /// </summary>
        /// <param name="term"></param>
        /// <returns></returns>
        private Search BuildQueryStringSearch(string term)
        {
            var names = "";
            if (term != null)
            {
                names = term.Replace("+", " OR *");
            }

            var search = new Search
            {
                Query = new Query(new QueryStringQuery(names + "*"))
            };

            return search;
        }
    }

}
