from llama_index.core import SimpleDirectoryReader
import os
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings
from llama_index.core import VectorStoreIndex
from llama_index.core import PromptTemplate
from llama_index.llms.ollama import Ollama
import dill as pickle

def vectordatabasemaker():

# load data
    script_dir = os.path.dirname(__file__)
    temp_dir = os.path.join(script_dir, "pdfs")

    loader = SimpleDirectoryReader(
                #input_dir = os.path.join(os.getcwd(), "pdfs"), 
                input_dir=temp_dir,
                required_exts=[".pdf"],
                recursive=True
    )

    docs = loader.load_data()

    embed_model = HuggingFaceEmbedding( model_name="BAAI/bge-large-en-v1.5", trust_remote_code=True)

        # ====== Create vector store and upload indexed data ======
    Settings.embed_model = embed_model # we specify the embedding model to be used
    index = VectorStoreIndex.from_documents(docs)

        # ===== Add a line of code that saves "index" to a file type that can be accessed from other files ===== #

        # Save the index
    with open('index.pkl', 'wb') as f:
        pickle.dump(index, f)
    
vectordatabasemaker()
