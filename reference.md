# Reference
<details><summary><code>client.<a href="/src/Client.ts">parse</a>({ ...params }) -> Extend.ParseRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Parse a file synchronously, waiting for the result before returning. This endpoint has a **5-minute timeout** — if processing takes longer, the request will fail.

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /parse_runs` with webhooks or polling instead, as it provides better reliability for large files and avoids timeout issues.

The Parse endpoint allows you to convert documents into structured, machine-readable formats with fine-grained control over the parsing process. This endpoint is ideal for extracting cleaned document content to be used as context for downstream processing, e.g. RAG pipelines, custom ingestion pipelines, embeddings classification, etc.

For more details, see the [Parse File guide](https://docs.extend.ai/2026-02-09/product/parsing/parse).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.parse({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ParseRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtendClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/Client.ts">edit</a>({ ...params }) -> Extend.EditRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Edit a file synchronously, waiting for the result before returning. This endpoint has a **5-minute timeout** — if processing takes longer, the request will fail.

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /edit_runs` with webhooks or polling instead, as it provides better reliability for large files and avoids timeout issues.

The Edit endpoint allows you to detect and fill form fields in PDF documents.

For more details, see the [Edit File guide](https://docs.extend.ai/2026-02-09/product/editing/edit).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.edit({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.EditRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtendClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/Client.ts">extract</a>({ ...params }) -> Extend.ExtractRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Extract structured data from a file synchronously, waiting for the result before returning. This endpoint has a **5-minute timeout** — if processing takes longer, the request will fail.

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /extract_runs` with webhooks or polling instead, as it provides better reliability for large files and avoids timeout issues.

The Extract endpoint allows you to extract structured data from files using an existing extractor or an inline configuration.

For more details, see the [Extract File guide](https://docs.extend.ai/2026-02-09/product/extracting/extract).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extract({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ExtractRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtendClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/Client.ts">classify</a>({ ...params }) -> Extend.ClassifyRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Classify a document synchronously, waiting for the result before returning. This endpoint has a **5-minute timeout** — if processing takes longer, the request will fail.

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /classify_runs` with webhooks or polling instead, as it provides better reliability for large files and avoids timeout issues.

The Classify endpoint allows you to classify documents using an existing classifier or an inline configuration.

For more details, see the [Classify File guide](https://docs.extend.ai/2026-02-09/product/classifying/classify).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classify({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ClassifyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtendClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/Client.ts">split</a>({ ...params }) -> Extend.SplitRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Split a document synchronously, waiting for the result before returning. This endpoint has a **5-minute timeout** — if processing takes longer, the request will fail.

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /split_runs` with webhooks or polling instead, as it provides better reliability for large files and avoids timeout issues.

The Split endpoint allows you to split documents into multiple parts using an existing splitter or an inline configuration.

For more details, see the [Split File guide](https://docs.extend.ai/2026-02-09/product/splitting/split).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.split({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.SplitRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtendClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Files
<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">list</a>({ ...params }) -> Extend.FilesListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List files.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.FilesListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FilesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.File_</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fetch a file by its ID.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.retrieve("file_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

ID for the file. It will always start with `"file_"`.

Example: `"file_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.FilesRetrieveRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FilesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">delete</a>(id) -> Extend.FilesDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a file and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than automated data retention policies. Or make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.delete("file_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the file to delete.

Example: `"file_xK9mLPqRtN3vS8wF5hB2cQ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FilesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">upload</a>(file) -> Extend.File_</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Upload and create a new file in Extend.

This endpoint accepts file contents and registers them as a File in Extend, which can be used for [running workflows](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/workflow/run-workflow), [creating evaluation set items](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/evaluation/bulk-create-evaluation-set-items), [parsing](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/parse/parse-file), etc.

If an uploaded file is detected as a Word or PowerPoint document, it will be automatically converted to a PDF.

Supported file types can be found [here](https://docs.extend.ai/2026-02-09/product/general/supported-file-types).

This endpoint requires multipart form encoding. Most HTTP clients will handle this encoding automatically (see the examples).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.upload(createReadStream("path/to/file"));

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**file:** `File | fs.ReadStream | Blob` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FilesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ParseRuns
<details><summary><code>client.parseRuns.<a href="/src/api/resources/parseRuns/client/Client.ts">create</a>({ ...params }) -> Extend.ParseRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Parse files to get cleaned, chunked target content (e.g. markdown).

The Parse endpoint allows you to convert documents into structured, machine-readable formats with fine-grained control over the parsing process. This endpoint is ideal for extracting cleaned document content to be used as context for downstream processing, e.g. RAG pipelines, custom ingestion pipelines, embeddings classification, etc.

For more details, see the [Parse File guide](https://docs.extend.ai/2026-02-09/product/parsing/parse).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.parseRuns.create({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ParseRunsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ParseRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.parseRuns.<a href="/src/api/resources/parseRuns/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.ParseRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the status and results of a parse run.

Use this endpoint to get results for a parse run that has already completed, or to check on the status of a parse run initiated by the [Create Parse Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/parse/create-parse-run) endpoint.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.parseRuns.retrieve("parse_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier for the parse run.

Example: `"pr_xK9mLPqRtN3vS8wF5hB2cQ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ParseRunsRetrieveRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ParseRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.parseRuns.<a href="/src/api/resources/parseRuns/client/Client.ts">delete</a>(id) -> Extend.ParseRunsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a parse run and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than automated data retention policies. Or make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.parseRuns.delete("parse_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the parse run to delete.

Example: `"pr_xK9mLPqRtN3vS8wF5hB2cQ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ParseRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## EditRuns
<details><summary><code>client.editRuns.<a href="/src/api/resources/editRuns/client/Client.ts">create</a>({ ...params }) -> Extend.EditRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Edit and manipulate PDF documents by detecting and filling form fields.

The Edit Runs endpoint allows you to convert and edit documents and get an edit run ID that can be used to check status and retrieve results with the [Get Edit Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/edit/get-edit-run) endpoint.

For more details, see the [Edit File guide](https://docs.extend.ai/2026-02-09/product/editing/edit).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.editRuns.create({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.EditRunsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EditRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.editRuns.<a href="/src/api/resources/editRuns/client/Client.ts">retrieve</a>(id) -> Extend.EditRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the status and results of an edit run.

Use this endpoint to get results for an edit run that has already completed, or to check on the status of an edit run initiated via the [Create Edit Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/edit/create-edit-run) endpoint.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.editRuns.retrieve("edit_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier for the edit run.

Example: `"edr_xK9mLPqRtN3vS8wF5hB2cQ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EditRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.editRuns.<a href="/src/api/resources/editRuns/client/Client.ts">delete</a>(id) -> Extend.EditRunsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an edit run and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than relying on automated data retention policies, or to make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.editRuns.delete("edit_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the edit run to delete.

Example: `"edr_xK9mLPqRtN3vS8wF5hB2cQ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EditRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ExtractRuns
<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">list</a>({ ...params }) -> Extend.ExtractRunsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all extract runs.

Returns a summary of each run. Use `GET /extract_runs/{id}` to retrieve the full object including `output` and `config`.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractRuns.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ExtractRunsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">create</a>({ ...params }) -> Extend.ExtractRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Extract structured data from a file using an existing extractor or an inline configuration.

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the [Get Extract Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/extract/get-extract-run) endpoint for results.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractRuns.create({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ExtractRunsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">retrieve</a>(id) -> Extend.ExtractRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a specific extract run, including its status, outputs, and any edits made during review.

A common use case for this endpoint is to poll for the status and final output of an extract run when using the [Create Extract Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/extract/create-extract-run) endpoint. For instance, if you do not want to not configure webhooks to receive the output via completion/failure events.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractRuns.retrieve("extract_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier for this extract run.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">delete</a>(id) -> Extend.ExtractRunsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an extract run and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than automated data retention policies. Or make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractRuns.delete("id");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the extract run.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">cancel</a>(id) -> Extend.ExtractRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel an in-progress extract run.

Note: Only extract runs with a status of `"PROCESSING"` can be cancelled. Extractor runs that have already completed, failed, or been cancelled cannot be cancelled again.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractRuns.cancel("extract_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the extract run to cancel.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Extractors
<details><summary><code>client.extractors.<a href="/src/api/resources/extractors/client/Client.ts">list</a>({ ...params }) -> Extend.ExtractorsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all extractors.

Returns a summary of each extractor. Use `GET /extractors/{id}` to retrieve the full object including `draftVersion`.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractors.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ExtractorsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractorsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractors.<a href="/src/api/resources/extractors/client/Client.ts">create</a>({ ...params }) -> Extend.Extractor</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new extractor.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractors.create({
    name: "name"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ExtractorsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractorsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractors.<a href="/src/api/resources/extractors/client/Client.ts">retrieve</a>(id) -> Extend.Extractor</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details of an extractor.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractors.retrieve("extractor_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the extractor to get.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractorsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractors.<a href="/src/api/resources/extractors/client/Client.ts">update</a>(id, { ...params }) -> Extend.Extractor</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an existing extractor.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractors.update("extractor_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the extractor to update.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ExtractorsUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractorsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ExtractorVersions
<details><summary><code>client.extractorVersions.<a href="/src/api/resources/extractorVersions/client/Client.ts">list</a>(extractorId, { ...params }) -> Extend.ExtractorVersionsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to fetch all versions of a given extractor, including the current `draft` version.

Versions are returned in descending order of creation (newest first) with the `draft` version first. The `draft` version is the latest unpublished version of the extractor, which can be published to create a new version. It might not have any changes from the last published version.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractorVersions.list("extractor_id_here", {
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**extractorId:** `string` 

The ID of the extractor.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ExtractorVersionsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractorVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractorVersions.<a href="/src/api/resources/extractorVersions/client/Client.ts">create</a>(extractorId, { ...params }) -> Extend.ExtractorVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to publish a new version of an existing extractor. Publishing a new version creates a snapshot of the extractor's current configuration and makes it available for use in workflows.

Publishing a new version does not automatically update existing workflows using this extractor. You may need to manually update workflows to use the new version if desired.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractorVersions.create("extractor_id_here", {
    releaseType: "major"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**extractorId:** `string` 

The ID of the extractor.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ExtractorVersionsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractorVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.extractorVersions.<a href="/src/api/resources/extractorVersions/client/Client.ts">retrieve</a>(extractorId, versionId) -> Extend.ExtractorVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific version of an extractor in Extend
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractorVersions.retrieve("extractor_id_here", "extractor_version_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**extractorId:** `string` 

The ID of the extractor.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**versionId:** `string` 

The ID of the specific extractor version.

Example: `"extv_QYk6jgHA_8CsO8rVWhyNC"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractorVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ClassifyRuns
<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">list</a>({ ...params }) -> Extend.ClassifyRunsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all classify runs.

Returns a summary of each run. Use `GET /classify_runs/{id}` to retrieve the full object including `output` and `config`.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifyRuns.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ClassifyRunsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifyRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">create</a>({ ...params }) -> Extend.ClassifyRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Classify a document using an existing classifier or an inline configuration.

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the [Get Classify Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/classify/get-classify-run) endpoint for results.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifyRuns.create({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ClassifyRunsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifyRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">retrieve</a>(id) -> Extend.ClassifyRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a specific classify run, including its status and outputs.

A common use case for this endpoint is to poll for the status and final output of a classify run when using the [Create Classify Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/classify/create-classify-run) endpoint. For instance, if you do not want to not configure webhooks to receive the output via completion/failure events.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifyRuns.retrieve("classify_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier for this classify run.

Example: `"cl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifyRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">delete</a>(id) -> Extend.ClassifyRunsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a classify run and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than automated data retention policies. Or make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifyRuns.delete("id");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the classify run.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifyRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">cancel</a>(id) -> Extend.ClassifyRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel an in-progress classify run.

Note: Only classify runs with a status of `"PROCESSING"` can be cancelled. Classifier runs that have already completed, failed, or been cancelled cannot be cancelled again.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifyRuns.cancel("classify_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the classify run to cancel.

Example: `"cl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifyRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Classifiers
<details><summary><code>client.classifiers.<a href="/src/api/resources/classifiers/client/Client.ts">list</a>({ ...params }) -> Extend.ClassifiersListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all classifiers.

Returns a summary of each classifier. Use `GET /classifiers/{id}` to retrieve the full object including `draftVersion`.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifiers.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ClassifiersListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifiersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifiers.<a href="/src/api/resources/classifiers/client/Client.ts">create</a>({ ...params }) -> Extend.Classifier</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new classifier.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifiers.create({
    name: "name"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ClassifiersCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifiersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifiers.<a href="/src/api/resources/classifiers/client/Client.ts">retrieve</a>(id) -> Extend.Classifier</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details of a classifier.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifiers.retrieve("classifier_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the classifier to get.

Example: `"cl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifiersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifiers.<a href="/src/api/resources/classifiers/client/Client.ts">update</a>(id, { ...params }) -> Extend.Classifier</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an existing classifier.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifiers.update("classifier_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the classifier to update.

Example: `"cl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ClassifiersUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifiersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ClassifierVersions
<details><summary><code>client.classifierVersions.<a href="/src/api/resources/classifierVersions/client/Client.ts">list</a>(classifierId, { ...params }) -> Extend.ClassifierVersionsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to fetch all versions of a given classifier, including the current `draft` version.

Versions are returned in descending order of creation (newest first) with the `draft` version first. The `draft` version is the latest unpublished version of the classifier, which can be published to create a new version. It might not have any changes from the last published version.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifierVersions.list("classifier_id_here", {
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**classifierId:** `string` 

The ID of the classifier.

Example: `"cl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ClassifierVersionsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifierVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifierVersions.<a href="/src/api/resources/classifierVersions/client/Client.ts">create</a>(classifierId, { ...params }) -> Extend.ClassifierVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to publish a new version of an existing classifier. Publishing a new version creates a snapshot of the classifier's current configuration and makes it available for use in workflows.

Publishing a new version does not automatically update existing workflows using this classifier. You may need to manually update workflows to use the new version if desired.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifierVersions.create("classifier_id_here", {
    releaseType: "major"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**classifierId:** `string` 

The ID of the classifier.

Example: `"cl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ClassifierVersionsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifierVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.classifierVersions.<a href="/src/api/resources/classifierVersions/client/Client.ts">retrieve</a>(classifierId, versionId) -> Extend.ClassifierVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific version of a classifier in Extend
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.classifierVersions.retrieve("classifier_id_here", "classifier_version_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**classifierId:** `string` 

The ID of the classifier.

Example: `"cl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**versionId:** `string` 

The ID of the specific classifier version.

Example: `"clsv_QYk6jgHA_8CsO8rVWhyNC"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClassifierVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## SplitRuns
<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">list</a>({ ...params }) -> Extend.SplitRunsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all split runs.

Returns a summary of each run. Use `GET /split_runs/{id}` to retrieve the full object including `output` and `config`.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitRuns.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.SplitRunsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">create</a>({ ...params }) -> Extend.SplitRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Split a document into multiple parts using an existing splitter or an inline configuration.

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the [Get Split Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/split/get-split-run) endpoint for results.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitRuns.create({
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.SplitRunsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">retrieve</a>(id) -> Extend.SplitRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a specific split run, including its status and outputs.

A common use case for this endpoint is to poll for the status and final output of a split run when using the [Create Split Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/split/create-split-run) endpoint. For instance, if you do not want to not configure webhooks to receive the output via completion/failure events.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitRuns.retrieve("split_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier for this split run.

Example: `"spl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">delete</a>(id) -> Extend.SplitRunsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a split run and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than automated data retention policies. Or make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitRuns.delete("id");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the split run.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">cancel</a>(id) -> Extend.SplitRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel an in-progress split run.

Note: Only split runs with a status of `"PROCESSING"` can be cancelled. Splitter runs that have already completed, failed, or been cancelled cannot be cancelled again.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitRuns.cancel("split_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the split run to cancel.

Example: `"spl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Splitters
<details><summary><code>client.splitters.<a href="/src/api/resources/splitters/client/Client.ts">list</a>({ ...params }) -> Extend.SplittersListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all splitters.

Returns a summary of each splitter. Use `GET /splitters/{id}` to retrieve the full object including `draftVersion`.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitters.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.SplittersListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplittersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitters.<a href="/src/api/resources/splitters/client/Client.ts">create</a>({ ...params }) -> Extend.Splitter</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new splitter.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitters.create({
    name: "name"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.SplittersCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplittersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitters.<a href="/src/api/resources/splitters/client/Client.ts">retrieve</a>(id) -> Extend.Splitter</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details of a splitter.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitters.retrieve("splitter_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the splitter to get.

Example: `"spl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplittersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitters.<a href="/src/api/resources/splitters/client/Client.ts">update</a>(id, { ...params }) -> Extend.Splitter</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an existing splitter.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitters.update("splitter_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the splitter to update.

Example: `"spl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.SplittersUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplittersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## SplitterVersions
<details><summary><code>client.splitterVersions.<a href="/src/api/resources/splitterVersions/client/Client.ts">list</a>(splitterId, { ...params }) -> Extend.SplitterVersionsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to fetch all versions of a given splitter, including the current `draft` version.

Versions are returned in descending order of creation (newest first) with the `draft` version first. The `draft` version is the latest unpublished version of the splitter, which can be published to create a new version. It might not have any changes from the last published version.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitterVersions.list("splitter_id_here", {
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**splitterId:** `string` 

The ID of the splitter.

Example: `"spl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.SplitterVersionsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitterVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitterVersions.<a href="/src/api/resources/splitterVersions/client/Client.ts">create</a>(splitterId, { ...params }) -> Extend.SplitterVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to publish a new version of an existing splitter. Publishing a new version creates a snapshot of the splitter's current configuration and makes it available for use in workflows.

Publishing a new version does not automatically update existing workflows using this splitter. You may need to manually update workflows to use the new version if desired.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitterVersions.create("splitter_id_here", {
    releaseType: "major"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**splitterId:** `string` 

The ID of the splitter.

Example: `"spl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.SplitterVersionsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitterVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.splitterVersions.<a href="/src/api/resources/splitterVersions/client/Client.ts">retrieve</a>(splitterId, versionId) -> Extend.SplitterVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific version of a splitter in Extend
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.splitterVersions.retrieve("splitter_id_here", "splitter_version_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**splitterId:** `string` 

The ID of the splitter.

Example: `"spl_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**versionId:** `string` 

The ID of the specific splitter version.

Example: `"splv_QYk6jgHA_8CsO8rVWhyNC"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SplitterVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Workflows
<details><summary><code>client.workflows.<a href="/src/api/resources/workflows/client/Client.ts">create</a>({ ...params }) -> Extend.Workflow</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new workflow in Extend. Workflows are sequences of steps that process files and data in a specific order to achieve a desired outcome.

This endpoint will create a new workflow in Extend, which can then be configured and deployed. Typically, workflows are created from our UI, however this endpoint can be used to create workflows programmatically. Configuration of the flow still needs to be done in the dashboard.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflows.create({
    name: "Invoice Processing"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.WorkflowsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## WorkflowRuns
<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">list</a>({ ...params }) -> Extend.WorkflowRunsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List runs of a Workflow. Workflows are sequences of steps that process files and data in a specific order to achieve a desired outcome. A WorkflowRun represents a single execution of a workflow against a file.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflowRuns.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.WorkflowRunsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">create</a>({ ...params }) -> Extend.WorkflowRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Run a workflow with a file. A workflow is a sequence of steps that process files and data in a specific order to achieve a desired outcome.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflowRuns.create({
    workflow: {
        id: "workflow_BMdfq_yWM3sT-ZzvCnA3f"
    },
    file: {
        url: "url"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.WorkflowRunsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">retrieve</a>(id) -> Extend.WorkflowRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Once a workflow has been run, you can check the status and output of a specific WorkflowRun.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflowRuns.retrieve("workflow_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the workflow run.

Example: `"workflow_run_xKm9pNv3qWsY_jL2tR5Dh"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">update</a>(id, { ...params }) -> Extend.WorkflowRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

You can update the name and metadata of an in progress WorkflowRun at any time using this endpoint.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflowRuns.update("workflow_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the workflow run.

Example: `"workflow_run_xKm9pNv3qWsY_jL2tR5Dh"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WorkflowRunsUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">delete</a>(id) -> Extend.WorkflowRunsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a workflow run and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than automated data retention policies. Or make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflowRuns.delete("workflow_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the workflow run.

Example: `"workflow_run_xKm9pNv3qWsY_jL2tR5Dh"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">cancel</a>(id) -> Extend.WorkflowRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel a running workflow run by its ID. This endpoint allows you to stop a workflow run that is currently in progress.

Note: Only workflow runs with a status of `PROCESSING` or `PENDING` can be cancelled. Workflow runs that are completed, failed, in review, rejected, or already cancelled cannot be cancelled.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflowRuns.cancel("workflow_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the workflow run.

Example: `"workflow_run_xKm9pNv3qWsY_jL2tR5Dh"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">createBatch</a>({ ...params }) -> Extend.WorkflowRunsCreateBatchResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to efficiently initiate large batches of workflow runs in a single request (up to 1,000 in a single request, but you can queue up multiple batches in rapid succession). It accepts an array of inputs, each containing a file and metadata pair. The primary use case for this endpoint is for doing large bulk runs of >1000 files at a time that can process over the course of a few hours without needing to manage rate limits that would likely occur using the primary run endpoint.

Unlike the single [Run Workflow](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/workflow/run-workflow) endpoint which returns the details of the created workflow runs immediately, this batch endpoint returns a `batchId`.

Our recommended usage pattern is to integrate with [Webhooks](https://docs.extend.ai/2026-02-09/product/webhooks/configuration) for consuming results, using the `metadata` and `batchId` to match up results to the original inputs in your downstream systems. However, you can integrate in a polling mechanism by using a combination of the [List Workflow Runs](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/workflow/list-workflow-runs) endpoint to fetch all runs via a batch, and then [Get Workflow Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/workflow/get-workflow-run) to fetch the full outputs each run.

**Priority:** All workflow runs created through this batch endpoint are automatically assigned a priority of 90.

**Processing and Monitoring:**
Upon successful submission, the endpoint returns a `batchId`. The individual workflow runs are then queued for processing.

- **Monitoring:** Track the progress and consume results of individual runs using [Webhooks](https://docs.extend.ai/2026-02-09/product/webhooks/configuration). Subscribe to events like `workflow_run.completed`, `workflow_run.failed`, etc. The webhook payload for these events will include the corresponding `batchId` and the `metadata` you provided for each input.
- **Fetching Results:** You can also use the [List Workflow Runs](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/workflow/list-workflow-runs) endpoint and filter using the `batchId` query param.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workflowRuns.createBatch({
    workflow: {
        id: "workflow_BMdfq_yWM3sT-ZzvCnA3f"
    },
    inputs: [{
            file: {
                url: "url"
            }
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.WorkflowRunsCreateBatchRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ProcessorRun
<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">list</a>({ ...params }) -> Extend.ProcessorRunListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List runs of a Processor. A ProcessorRun represents a single execution of a processor against a file.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorRun.list({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ProcessorRunListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRunClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">create</a>({ ...params }) -> Extend.ProcessorRunCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Run processors (extraction, classification, splitting, etc.) on a given document.

**Synchronous vs Asynchronous Processing:**
- **Asynchronous (default)**: Returns immediately with `PROCESSING` status. Use webhooks or polling to get results.
- **Synchronous**: Set `sync: true` to wait for completion and get final results in the response (5-minute timeout).

**For asynchronous processing:**
- You can [configure webhooks](https://docs.extend.ai/product/webhooks/configuration) to receive notifications when a processor run is complete or failed.
- Or you can [poll the get endpoint](https://docs.extend.ai/2025-04-21/developers/api-reference/processor-endpoints/get-processor-run) for updates on the status of the processor run.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorRun.create({
    processorId: "processor_id_here"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ProcessorRunCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRunClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">get</a>(id) -> Extend.ProcessorRunGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a specific processor run, including its status, outputs, and any edits made during review.

A common use case for this endpoint is to poll for the status and final output of an async processor run when using the [Run Processor](https://docs.extend.ai/2025-04-21/developers/api-reference/processor-endpoints/run-processor) endpoint. For instance, if you do not want to not configure webhooks to receive the output via completion/failure events.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorRun.get("processor_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier for this processor run.

Example: `"exr_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRunClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">delete</a>(id) -> Extend.ProcessorRunDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a processor run and all associated data from Extend. This operation is permanent and cannot be undone.

This endpoint can be used if you'd like to manage data retention on your own rather than automated data retention policies. Or make one-off deletions for your downstream customers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorRun.delete("processor_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the processor run to delete.

Example: `"exr_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRunClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">cancel</a>(id) -> Extend.ProcessorRunCancelResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel a running processor run by its ID. This endpoint allows you to stop a processor run that is currently in progress.

Note: Only processor runs with a status of `"PROCESSING"` can be cancelled. Processor runs that have already completed, failed, or been cancelled cannot be cancelled again.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorRun.cancel("processor_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier for the processor run to cancel.

Example: `"exr_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRunClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Processor
<details><summary><code>client.processor.<a href="/src/api/resources/processor/client/Client.ts">list</a>({ ...params }) -> Extend.LegacyListProcessorsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all processors in your organization
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processor.list();

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ProcessorListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processor.<a href="/src/api/resources/processor/client/Client.ts">create</a>({ ...params }) -> Extend.ProcessorCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new processor in Extend, optionally cloning from an existing processor
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processor.create({
    name: "My Processor Name",
    type: "EXTRACT"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.ProcessorCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processor.<a href="/src/api/resources/processor/client/Client.ts">update</a>(id, { ...params }) -> Extend.ProcessorUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an existing processor in Extend
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processor.update("processor_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the processor to update.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ProcessorUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ProcessorVersion
<details><summary><code>client.processorVersion.<a href="/src/api/resources/processorVersion/client/Client.ts">list</a>(id) -> Extend.ProcessorVersionListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to fetch all versions of a given processor, including the current `draft` version.

Versions are typically returned in descending order of creation (newest first), but this should be confirmed in the actual implementation.
The `draft` version is the latest unpublished version of the processor, which can be published to create a new version. It might not have any changes from the last published version.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorVersion.list("processor_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the processor to retrieve versions for.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorVersionClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processorVersion.<a href="/src/api/resources/processorVersion/client/Client.ts">create</a>(id, { ...params }) -> Extend.ProcessorVersionCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to publish a new version of an existing processor. Publishing a new version creates a snapshot of the processor's current configuration and makes it available for use in workflows.

Publishing a new version does not automatically update existing workflows using this processor. You may need to manually update workflows to use the new version if desired.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorVersion.create("processor_id_here", {
    releaseType: "major"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the processor to publish a new version for.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ProcessorVersionCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorVersionClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.processorVersion.<a href="/src/api/resources/processorVersion/client/Client.ts">get</a>(processorId, processorVersionId) -> Extend.ProcessorVersionGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific version of a processor in Extend
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.processorVersion.get("processor_id_here", "processor_version_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**processorId:** `string` 

The ID of the processor.

Example: `"ex_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**processorVersionId:** `string` 

The ID of the specific processor version to retrieve.

Example: `"exv_QYk6jgHA_8CsO8rVWhyNC"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorVersionClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## BatchProcessorRun
<details><summary><code>client.batchProcessorRun.<a href="/src/api/resources/batchProcessorRun/client/Client.ts">get</a>(id) -> Extend.BatchProcessorRunGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a batch processor run, including evaluation runs.

**Deprecated:** This endpoint is maintained for backwards compatibility only and will be replaced in a future API version. Use [Get Evaluation Set Run](/2026-02-09/developers/api-reference/endpoints/evaluation/get-evaluation-set-run) for interacting with evaluation set runs.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.batchProcessorRun.get("bpr_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The unique identifier of the batch processor run to retrieve.

Example: `"bpr_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `BatchProcessorRunClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## EvaluationSets
<details><summary><code>client.evaluationSets.<a href="/src/api/resources/evaluationSets/client/Client.ts">list</a>({ ...params }) -> Extend.EvaluationSetsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List evaluation sets in your account.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSets.list({
    entityId: "entity_id_here",
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.EvaluationSetsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.evaluationSets.<a href="/src/api/resources/evaluationSets/client/Client.ts">create</a>({ ...params }) -> Extend.EvaluationSet</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Evaluation sets are collections of files and expected outputs that are used to evaluate the performance of a given extractor, classifier, or splitter. This endpoint will create a new evaluation set, which items can be added to using the [Create Evaluation Set Item](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/evaluation/create-evaluation-set-item) endpoint.

Note: It is not necessary to create an evaluation set via API. You can also create an evaluation set via the Extend dashboard and take the ID from there. To learn more about how to create evaluation sets, see the [Evaluation Sets](https://docs.extend.ai/product/evaluation/overview) product page.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSets.create({
    name: "My Evaluation Set",
    entityId: "entity_id_here"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Extend.EvaluationSetsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.evaluationSets.<a href="/src/api/resources/evaluationSets/client/Client.ts">retrieve</a>(id) -> Extend.EvaluationSet</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific evaluation set by ID. This returns an evaluation set object, but does not include the items in the evaluation set. You can use the [List Evaluation Set Items](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/evaluation/list-evaluation-set-items) endpoint to get the items in an evaluation set.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSets.retrieve("evaluation_set_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the evaluation set.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## EvaluationSetItems
<details><summary><code>client.evaluationSetItems.<a href="/src/api/resources/evaluationSetItems/client/Client.ts">list</a>(evaluationSetId, { ...params }) -> Extend.EvaluationSetItemsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List items in a specific evaluation set.

Returns a summary of each evaluation set item. Use the [Get Evaluation Set Item](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/evaluation/get-evaluation-set-item) endpoint to get the full details of an evaluation set item.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSetItems.list("evaluation_set_id_here", {
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ="
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**evaluationSetId:** `string` 

The ID of the evaluation set.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.EvaluationSetItemsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItemsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetItems.<a href="/src/api/resources/evaluationSetItems/client/Client.ts">create</a>(evaluationSetId, { ...params }) -> Extend.EvaluationSetItemsCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Evaluation set items are the individual files and expected outputs that are used to evaluate the performance of a given extractor, classifier, or splitter in Extend. This endpoint will create new evaluation set items in Extend, which will be used during an evaluation run.

**Limit:** You can create up to 100 items at a time.

Learn more about how to create evaluation set items in the [Evaluation Sets](https://docs.extend.ai/product/evaluation/overview) product page.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSetItems.create("evaluation_set_id_here", {
    items: [{
            fileId: "file_id_here",
            expectedOutput: {}
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**evaluationSetId:** `string` 

The ID of the evaluation set.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.EvaluationSetItemsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItemsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetItems.<a href="/src/api/resources/evaluationSetItems/client/Client.ts">retrieve</a>(evaluationSetId, itemId) -> Extend.EvaluationSetItem</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details of an evaluation set item.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSetItems.retrieve("evaluation_set_id_here", "evaluation_set_item_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**evaluationSetId:** `string` 

The ID of the evaluation set.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`
    
</dd>
</dl>

<dl>
<dd>

**itemId:** `string` 

The ID of the evaluation set item.

Example: `"evi_kR9mNP12Qw4yTv8BdR3H"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItemsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetItems.<a href="/src/api/resources/evaluationSetItems/client/Client.ts">update</a>(evaluationSetId, itemId, { ...params }) -> Extend.EvaluationSetItem</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

If you need to change the expected output for a given evaluation set item, you can use this endpoint to update the item. This can be useful if you need to correct an error in the expected output or if the output of the extractor, classifier, or splitter has changed.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSetItems.update("evaluation_set_id_here", "evaluation_set_item_id_here", {
    expectedOutput: {}
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**evaluationSetId:** `string` 

The ID of the evaluation set.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`
    
</dd>
</dl>

<dl>
<dd>

**itemId:** `string` 

The ID of the evaluation set item.

Example: `"evi_kR9mNP12Qw4yTv8BdR3H"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.EvaluationSetItemsUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItemsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetItems.<a href="/src/api/resources/evaluationSetItems/client/Client.ts">delete</a>(evaluationSetId, itemId) -> Extend.EvaluationSetItemsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an evaluation set item.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSetItems.delete("evaluation_set_id_here", "evaluation_set_item_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**evaluationSetId:** `string` 

The ID of the evaluation set.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`
    
</dd>
</dl>

<dl>
<dd>

**itemId:** `string` 

The ID of the evaluation set item.

Example: `"evi_kR9mNP12Qw4yTv8BdR3H"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItemsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## EvaluationSetRuns
<details><summary><code>client.evaluationSetRuns.<a href="/src/api/resources/evaluationSetRuns/client/Client.ts">retrieve</a>(id) -> Extend.EvaluationSetRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details of an evaluation set run.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluationSetRuns.retrieve("evaluation_set_run_id_here");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` 

The ID of the evaluation set run.

Example: `"evr_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetRunsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
