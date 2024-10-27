Inspiration

Hermedoc was inspired by the power of general chatbots to streamline daily tasks, particularly for researchers and professionals in sensitive industries. Many of these users face restrictions with current LLMs that rely on cloud servers, making them unsuitable for handling sensitive data. The need for a secure, on-device solution became evident. Feedback from a financial advisor highlighted the tedious nature of compliance work, which involved referencing thousands of internal documents without the support of effective search tools. Similarly, a researcher for the Department of Defense expressed frustration over being prohibited from using unsecure, general purpose AI chatbots due to strict confidentiality protocols. These insights underscored the necessity for Hermedoc—a chat assistant that prioritizes user privacy while enabling efficient document processing.

What it does

Hermedoc empowers users to create a highly personalized and secure chat experience by allowing them to upload their own Private Contextual Data (PCD). This feature enables the chatbot to be tailored to specific questions and needs, ensuring relevant and accurate responses. By leveraging LLAMA for local LLM processing, Hermedoc maintains the highest security standards, eliminating concerns associated with cloud-based solutions. Users can confidently engage with their sensitive information, knowing that their data remains private and secure.

How we built it

Hermedoc is built on a robust technological foundation. We utilize LLAMA for local LLM processing, ensuring data privacy and security. The Hugging Face library is employed to create embeddings based on user-uploaded contextual data, enhancing the model’s understanding of specific queries. To manage our vector database, we use LlamaIndex, which facilitates data loading and serves as the interface between our vectorized data and LLAMA.

To optimize our development process, we adopted a parallelized workflow, allowing us to work on the vectorized database and query retrieval system simultaneously with the chatbot's frontend. The frontend is developed using React for an intuitive user experience, while Flask powers the backend, effectively tying the database's information to the frontend and ensuring smooth data processing.

Challenges we ran into

Building Hermedoc came with several technical challenges, especially in implementing the retrieval-augmented generation (RAG) system. The RAG setup required numerous iterations of installation and header file adjustments to ensure compatibility across all necessary libraries. This was crucial, as the query system is central to the user’s interaction with the chatbot. Additionally, working with large Private Contextual Data (PCD) samples caused testing delays and prompted us to consider future methods for securely offloading parts of the embedding process.

Data privacy constraints also limited our design choices. Running everything locally, including large embedded files for the RAG system, placed a strain on the limited computational resources of typical laptops. Our commitment to avoiding external servers for maximum security came at a performance cost, particularly when handling extensive PCD datasets. However, we recognize that many workplaces utilize internal, secure networks connected to additional computational resources, which could support Hermedoc in a more efficient setup. We also believe there are optimization opportunities within the RAG query model itself, such as reducing redundant computations through tuned groupings or using algorithms optimized for efficient search-space traversal.

Accomplishments that we're proud of

We take pride in developing a proprietary retrieval-augmented generation (RAG) framework that enables the LLAMA model to effectively interface with user-specified data, creating relevant contexts for generating precise answers. This innovative approach not only enhances the accuracy of responses but also ensures data security by processing everything locally.

Additionally, we are proud of our intuitive UI design, which strikes a balance between simplicity and power, making Hermedoc accessible to clients with varying levels of technical expertise. The novel combination of the RAG framework with LLAMA for secure processing stands out as a key innovation. Furthermore, the performance metrics indicate that Hermedoc consistently delivers organized and helpful responses based on the provided PCD and the questions asked.

What we learned

Developing Hermedoc provided us with valuable insights into various aspects of privacy-focused AI systems. We gained a deep understanding of the retrieval-augmented generation (RAG) framework and how it integrates with the LLAMA model, enhancing our skills in full-stack development. The project taught us how to seamlessly connect frontend and backend components, and we also explored creating a downloadable web application using Progressive Web App (PWA) technology, allowing for asynchronous functionality independent of the web browser.

Additionally, we learned the importance of effective tech product documentation, which is crucial for ensuring usability and understanding among users and developers alike. Overall, the development of Hermedoc significantly expanded our technical knowledge and expertise.

What's next for Hermedoc

As we look to the future, one of our primary goals is to enhance the efficiency of PCD embeddings and query retrievals, which are currently time-intensive due to the limitations of standalone PC computational abilities. In many workplace environments, computers are connected to internal, secure networks that can access additional computational resources, and we aim to leverage such setups for improved performance.

We also see significant opportunities for optimization within our RAG query model, particularly in reducing redundant computations through tuned groupings and the implementation of optimized algorithms for traversing the search space. Additionally, we are exploring the use of homomorphic encryption techniques, which would allow us to perform complex computations in the cloud on encrypted data, enhancing performance while maintaining data security. This approach would enable us to decrypt the transformed data after processing, ensuring that sensitive information remains protected throughout the computation process.
