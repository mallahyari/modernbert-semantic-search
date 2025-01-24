from fastapi import FastAPI, Query
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from rapidfuzz.process import extract
import uvicorn
from sentence_transformers import SentenceTransformer
from query_engline import client


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

collection_name = "modernbert_search"
print(client.has_collection(collection_name))

model = SentenceTransformer("nomic-ai/modernbert-embed-base")


with open("all_queries.txt", "r") as f:
    all_queries = [line.strip() for line in f.readlines()]

@app.get("/suggestions")
def get_suggestions(query: str = Query(..., min_length=1), max_results: int = 5):
    """
    Returns auto-suggestions based on the user's query.
    Args:
        query (str): The partial query input by the user.
        max_results (int): Maximum number of suggestions to return.
    """
    # Perform fuzzy matching
    matches = extract(query, all_queries, limit=max_results)
    suggestions = [match[0] for match in matches]
    return {"query": query, "suggestions": suggestions}



def search_papers(query, max_results=10) -> List[dict]:
    query_prefix = "search_query:"
    query_embeddings = model.encode(query_prefix + " " + query)
    # query_embeddings = model.encode(query)
    result = client.search(
        collection_name="modernbert_search",
        data=[query_embeddings],
        anns_field="dense_vector",
        limit=max_results,
        output_fields=["text"],
        search_params={"metric_type": "COSINE"}
    )
    # print(result[0])
    records = [
        {"title": paper["entity"]["text"], "score": paper["distance"]}
        for paper in result[0]
    ]
    return records


@app.get("/search")
async def search(query: str = Query(..., min_length=1), max_results: int = 10):
    results = search_papers(query, max_results)
    return {"query": query, "results": results}




if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8050)
