# Vector Database

## Data Form

~~~json
{
  "documents": [
    {
      "doc_id": "1",
      "content": "This is the first document.",
      "vector": [0.1, 0.2, 0.3, 0.4],
      "metadata": {
        "title": "Document 1",
        "author": "Author A",
        "created_at": "2023-01-01T12:00:00Z"
      }
    },
    {
      "doc_id": "2",
      "content": "This is the second document.",
      "vector": [0.2, 0.3, 0.4, 0.5],
      "metadata": {
        "title": "Document 2",
        "author": "Author B",
        "created_at": "2023-01-02T12:00:00Z"
      }
    }
  ]
}

~~~

# Data Retrieval Algorithm

Due to the curse of dimension and the large data amount, we have to use approximatation algorithm, like HNSW (Hierarchical Navigable Small World).

Below are some often-used industrial algorithms:

- Annoy: [Approximate Nearest Neighbour Oh Yeah](https://github.com/spotify/annoy)
- FAISS (based on HNSW)
- Locality sensitive hashing
- SCANN

# HNSW Algorithm

That's basically a combination of skip list and small-world network.

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/08/8_22_15_25_202408082215824.png"/>

# API

## Some Examples

SOAP: Simple Object Access Protocol
RPC: Remote Procedure CAlls
REST: REpresentational State Transfer

Other protocols: 
- Graph QL: GraphQL allows developers to make requests to fetch data from multiple data sources with a single API call.
- WebScoket: Server can send messages to clients without the clients' request.

## REST API

### Conventions

POST=CREATE
GET=SELECT
PUT=UPDATE
DELETE=DELETE

## Why do we need APIs?

Basically, API acts as an ABSTRACTION (and CONSISTENCT layer) between client and the implementation details.

You can change the model, the version of model, the architecture, etc that you actually use, without having to inform the customers that they have to change too.

