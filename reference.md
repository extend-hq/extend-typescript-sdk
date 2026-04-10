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

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /parse_runs` with [polling or webhooks](https://docs.extend.ai/2026-02-09/developers/async-processing) instead, as it provides better reliability for large files and avoids timeout issues.

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
        url: "https://example.com/bank_statement.pdf",
        name: "bank_statement.pdf"
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

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /edit_runs` with [polling or webhooks](https://docs.extend.ai/2026-02-09/developers/async-processing) instead, as it provides better reliability for large files and avoids timeout issues.

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
        url: "https://example.com/form.pdf"
    },
    config: {
        instructions: "Fill out the form with the provided data",
        advancedOptions: {
            flattenPdf: true
        }
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

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /extract_runs` with [polling or webhooks](https://docs.extend.ai/2026-02-09/developers/async-processing) instead, as it provides better reliability for large files and avoids timeout issues.

The Extract endpoint allows you to extract structured data from files using an existing extractor or an inline configuration.

For more details, see the [Extract File guide](https://docs.extend.ai/2026-02-09/product/extraction/quick-start-5-minutes).
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
    config: {
        schema: {
            "type": "object",
            "properties": {
                "vendor_name": {
                    "type": "string",
                    "description": "The name of the vendor"
                },
                "invoice_number": {
                    "type": "string",
                    "description": "The invoice number"
                },
                "total_amount": {
                    "type": "number",
                    "description": "The total amount due"
                }
            }
        }
    },
    file: {
        url: "https://example.com/invoice.pdf"
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

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /classify_runs` with [polling or webhooks](https://docs.extend.ai/2026-02-09/developers/async-processing) instead, as it provides better reliability for large files and avoids timeout issues.

The Classify endpoint allows you to classify documents using an existing classifier or an inline configuration.

For more details, see the [Classify File guide](https://docs.extend.ai/2026-02-09/product/classification/configuring-a-classifier).
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
    config: {
        classifications: [{
                id: "invoice",
                type: "invoice",
                description: "An invoice or bill for goods or services"
            }, {
                id: "receipt",
                type: "receipt",
                description: "A receipt confirming payment"
            }, {
                id: "other",
                type: "other",
                description: "Any other document type"
            }]
    },
    file: {
        url: "https://example.com/document.pdf"
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

**Note:** This endpoint is intended for onboarding and testing only. For production workloads, use `POST /split_runs` with [polling or webhooks](https://docs.extend.ai/2026-02-09/developers/async-processing) instead, as it provides better reliability for large files and avoids timeout issues.

The Split endpoint allows you to split documents into multiple parts using an existing splitter or an inline configuration.

For more details, see the [Split File guide](https://docs.extend.ai/2026-02-09/product/splitting/configuring-a-splitter).
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
    config: {
        splitClassifications: [{
                id: "invoice",
                type: "invoice",
                description: "An invoice or bill for goods or services",
                identifierKey: "invoice number from the document header"
            }, {
                id: "receipt",
                type: "receipt",
                description: "A receipt confirming payment",
                identifierKey: "receipt number"
            }, {
                id: "other",
                type: "other",
                description: "Any other document type"
            }]
    },
    file: {
        url: "https://example.com/multi-document.pdf"
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

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">delete</a>(id, { ...params }) -> Extend.FilesDeleteResponse</code></summary>
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

**request:** `Extend.FilesDeleteRequest` 
    
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

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">upload</a>(file, { ...params }) -> Extend.File_</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Upload and create a new file in Extend.

This endpoint accepts file contents and registers them as a File in Extend, which can be used for [running workflows](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/workflow/create-workflow-run), [creating evaluation set items](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/evaluation/create-evaluation-set-item), [parsing](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/parse/parse-file), etc.

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
await client.files.upload(createReadStream("path/to/file"), {});

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

**request:** `Extend.FilesUploadRequest` 
    
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

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the Get Parse Run endpoint for results.
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
        url: "https://example.com/bank_statement.pdf",
        name: "bank_statement.pdf"
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

<details><summary><code>client.parseRuns.<a href="/src/api/resources/parseRuns/client/Client.ts">delete</a>(id, { ...params }) -> Extend.ParseRunsDeleteResponse</code></summary>
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

**request:** `Extend.ParseRunsDeleteRequest` 
    
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

The Edit Runs endpoint allows you to convert and edit documents and get an edit run ID that can be used to check status and retrieve results with the Get Edit Run endpoint.

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the Get Edit Run endpoint for results.
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
        url: "https://example.com/form.pdf"
    },
    config: {
        instructions: "Fill out the form with the provided data",
        advancedOptions: {
            flattenPdf: true
        }
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

<details><summary><code>client.editRuns.<a href="/src/api/resources/editRuns/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.EditRun</code></summary>
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

**request:** `Extend.EditRunsRetrieveRequest` 
    
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

<details><summary><code>client.editRuns.<a href="/src/api/resources/editRuns/client/Client.ts">delete</a>(id, { ...params }) -> Extend.EditRunsDeleteResponse</code></summary>
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

**request:** `Extend.EditRunsDeleteRequest` 
    
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

## EditSchemas
<details><summary><code>client.editSchemas.<a href="/src/api/resources/editSchemas/client/Client.ts">generate</a>({ ...params }) -> Extend.EditSchemaGenerationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Detect fields in a PDF form and synchronously return an edit schema payload.

Use this endpoint when you want Extend to bootstrap an `EditRootJSON` schema from an existing form, optionally mapping an existing schema onto the detected fields.

This endpoint returns the generated schema directly. There are no schema generation run resources to poll or delete.

For more details, see the [Generate Edit Schema guide](https://docs.extend.ai/2026-02-09/product/editing/generate-edit-schema) and the [Edit File guide](https://docs.extend.ai/2026-02-09/product/editing/edit).
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
await client.editSchemas.generate({
    file: {
        url: "https://example.com/form.pdf"
    },
    config: {
        instructions: "Detect the form fields and use human-readable field names.",
        advancedOptions: {
            radioEnumsEnabled: true
        }
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

**request:** `Extend.EditSchemasGenerateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EditSchemasClient.RequestOptions` 
    
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

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the Get Extract Run endpoint for results.
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
    extractor: {
        id: "ex_1234567890"
    },
    file: {
        url: "https://example.com/invoice.pdf"
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

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.ExtractRun</code></summary>
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

**request:** `Extend.ExtractRunsRetrieveRequest` 
    
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

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">delete</a>(id, { ...params }) -> Extend.ExtractRunsDeleteResponse</code></summary>
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

**request:** `Extend.ExtractRunsDeleteRequest` 
    
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

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">cancel</a>(id, { ...params }) -> Extend.ExtractRun</code></summary>
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

**request:** `Extend.ExtractRunsCancelRequest` 
    
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

<details><summary><code>client.extractRuns.<a href="/src/api/resources/extractRuns/client/Client.ts">createBatch</a>({ ...params }) -> Extend.BatchRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit up to **1,000 files** for extraction in a single request. Each file is processed as an independent extract run using the same extractor and configuration.

Unlike the single [Extract File (Async)](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/extract/create-extract-run) endpoint, this batch endpoint accepts an `inputs` array and immediately returns a `BatchRun` object containing a batch `id` and a `PENDING` status. The individual runs are then queued and processed asynchronously.

**Monitoring results:**
- **Webhooks (recommended):** Subscribe to `batch_processor_run.processed` and `batch_processor_run.failed` events. The webhook payload indicates the batch has finished — fetch individual run results using `GET /extract_runs?batchId={id}`.
- **Polling:** Call `GET /batch_runs/{id}` to check the overall batch status, and use `GET /extract_runs` filtered by `batchId` to retrieve individual run results.

**Notes:**
- A processor reference (`extractor.id`) is required — inline `config` is not supported for batch requests.
- `inputs` must contain between 1 and 1,000 items.
- All inputs in a batch use the same extractor version and override config.
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
await client.extractRuns.createBatch({
    extractor: {
        id: "ex_xK9mLPqRtN3vS8wF5hB2cQ"
    },
    inputs: [{
            file: {
                url: "https://example.com/invoice1.pdf"
            },
            metadata: {
                "customerId": "cust_abc123"
            }
        }, {
            file: {
                url: "https://example.com/invoice2.pdf"
            },
            metadata: {
                "customerId": "cust_def456"
            }
        }, {
            file: {
                url: "https://example.com/invoice3.pdf"
            },
            metadata: {
                "customerId": "cust_ghi789"
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

**request:** `Extend.ExtractRunsCreateBatchRequest` 
    
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
    name: "Invoice Extractor",
    config: {
        schema: {
            "type": "object",
            "properties": {
                "vendor_name": {
                    "type": "string",
                    "description": "The name of the vendor"
                },
                "invoice_number": {
                    "type": "string",
                    "description": "The invoice number"
                },
                "total_amount": {
                    "type": "number",
                    "description": "The total amount due"
                }
            }
        }
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

<details><summary><code>client.extractors.<a href="/src/api/resources/extractors/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.Extractor</code></summary>
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

**request:** `Extend.ExtractorsRetrieveRequest` 
    
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
await client.extractors.update("extractor_id_here", {
    name: "Invoice Extractor v2"
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
    releaseType: "minor",
    description: "Updated extraction rules for better accuracy"
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

<details><summary><code>client.extractorVersions.<a href="/src/api/resources/extractorVersions/client/Client.ts">retrieve</a>(extractorId, versionId, { ...params }) -> Extend.ExtractorVersion</code></summary>
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
await client.extractorVersions.retrieve("extractor_id_here", "draft");

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

The version to retrieve. Accepts any of the following:

- `"draft"` — returns the current draft version
- `"latest"` — returns the latest published version (falls back to draft if none published)
- A version number (e.g. `"0.1"`, `"1.0"`) — returns that specific published version
- A version ID (e.g. `"extv_QYk6jgHA_8CsO8rVWhyNC"`) — returns that specific version by ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ExtractorVersionsRetrieveRequest` 
    
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

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the Get Classify Run endpoint for results.
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
    classifier: {
        id: "cl_1234567890"
    },
    file: {
        url: "https://example.com/document.pdf"
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

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.ClassifyRun</code></summary>
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

**request:** `Extend.ClassifyRunsRetrieveRequest` 
    
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

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">delete</a>(id, { ...params }) -> Extend.ClassifyRunsDeleteResponse</code></summary>
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

**request:** `Extend.ClassifyRunsDeleteRequest` 
    
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

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">cancel</a>(id, { ...params }) -> Extend.ClassifyRun</code></summary>
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

**request:** `Extend.ClassifyRunsCancelRequest` 
    
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

<details><summary><code>client.classifyRuns.<a href="/src/api/resources/classifyRuns/client/Client.ts">createBatch</a>({ ...params }) -> Extend.BatchRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit up to **1,000 files** for classification in a single request. Each file is processed as an independent classify run using the same classifier and configuration.

Unlike the single [Classify File (Async)](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/classify/create-classify-run) endpoint, this batch endpoint accepts an `inputs` array and immediately returns a `BatchRun` object containing a batch `id` and a `PENDING` status. The individual runs are then queued and processed asynchronously.

**Monitoring results:**
- **Webhooks (recommended):** Subscribe to `batch_processor_run.processed` and `batch_processor_run.failed` events. The webhook payload indicates the batch has finished — fetch individual run results using `GET /classify_runs?batchId={id}`.
- **Polling:** Call `GET /batch_runs/{id}` to check the overall batch status, and use `GET /classify_runs` filtered by `batchId` to retrieve individual run results.

**Notes:**
- A processor reference (`classifier.id`) is required — inline `config` is not supported for batch requests.
- `inputs` must contain between 1 and 1,000 items.
- All inputs in a batch use the same classifier version and override config.
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
await client.classifyRuns.createBatch({
    classifier: {
        id: "cl_xK9mLPqRtN3vS8wF5hB2cQ"
    },
    inputs: [{
            file: {
                url: "https://example.com/document1.pdf"
            },
            metadata: {
                "customerId": "cust_abc123"
            }
        }, {
            file: {
                url: "https://example.com/document2.pdf"
            },
            metadata: {
                "customerId": "cust_def456"
            }
        }, {
            file: {
                url: "https://example.com/document3.pdf"
            },
            metadata: {
                "customerId": "cust_ghi789"
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

**request:** `Extend.ClassifyRunsCreateBatchRequest` 
    
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
    name: "Document Classifier",
    config: {
        classifications: [{
                id: "invoice",
                type: "invoice",
                description: "An invoice or bill for goods or services"
            }, {
                id: "receipt",
                type: "receipt",
                description: "A receipt confirming payment"
            }, {
                id: "other",
                type: "other",
                description: "Any other document type"
            }]
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

<details><summary><code>client.classifiers.<a href="/src/api/resources/classifiers/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.Classifier</code></summary>
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

**request:** `Extend.ClassifiersRetrieveRequest` 
    
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
await client.classifiers.update("classifier_id_here", {
    name: "Document Classifier v2"
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
    releaseType: "minor",
    description: "Added new document classification type"
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

<details><summary><code>client.classifierVersions.<a href="/src/api/resources/classifierVersions/client/Client.ts">retrieve</a>(classifierId, versionId, { ...params }) -> Extend.ClassifierVersion</code></summary>
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
await client.classifierVersions.retrieve("classifier_id_here", "draft");

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

The version to retrieve. Accepts any of the following:

- `"draft"` — returns the current draft version
- `"latest"` — returns the latest published version (falls back to draft if none published)
- A version number (e.g. `"0.1"`, `"1.0"`) — returns that specific published version
- A version ID (e.g. `"clsv_QYk6jgHA_8CsO8rVWhyNC"`) — returns that specific version by ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ClassifierVersionsRetrieveRequest` 
    
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

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the Get Split Run endpoint for results.
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
    splitter: {
        id: "spl_1234567890"
    },
    file: {
        url: "https://example.com/multi-document.pdf"
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

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.SplitRun</code></summary>
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

**request:** `Extend.SplitRunsRetrieveRequest` 
    
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

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">delete</a>(id, { ...params }) -> Extend.SplitRunsDeleteResponse</code></summary>
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

**request:** `Extend.SplitRunsDeleteRequest` 
    
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

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">cancel</a>(id, { ...params }) -> Extend.SplitRun</code></summary>
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

**request:** `Extend.SplitRunsCancelRequest` 
    
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

<details><summary><code>client.splitRuns.<a href="/src/api/resources/splitRuns/client/Client.ts">createBatch</a>({ ...params }) -> Extend.BatchRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit up to **1,000 files** for splitting in a single request. Each file is processed as an independent split run using the same splitter and configuration.

Unlike the single [Split File (Async)](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/split/create-split-run) endpoint, this batch endpoint accepts an `inputs` array and immediately returns a `BatchRun` object containing a batch `id` and a `PENDING` status. The individual runs are then queued and processed asynchronously.

**Monitoring results:**
- **Webhooks (recommended):** Subscribe to `batch_processor_run.processed` and `batch_processor_run.failed` events. The webhook payload indicates the batch has finished — fetch individual run results using `GET /split_runs?batchId={id}`.
- **Polling:** Call `GET /batch_runs/{id}` to check the overall batch status, and use `GET /split_runs` filtered by `batchId` to retrieve individual run results.

**Notes:**
- A processor reference (`splitter.id`) is required — inline `config` is not supported for batch requests.
- `inputs` must contain between 1 and 1,000 items.
- All inputs in a batch use the same splitter version and override config.
- Raw text input (`FileFromText`) is not supported for split runs. Use a URL or file ID.
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
await client.splitRuns.createBatch({
    splitter: {
        id: "spl_xK9mLPqRtN3vS8wF5hB2cQ"
    },
    inputs: [{
            file: {
                url: "https://example.com/multi-doc1.pdf"
            },
            metadata: {
                "customerId": "cust_abc123"
            }
        }, {
            file: {
                url: "https://example.com/multi-doc2.pdf"
            },
            metadata: {
                "customerId": "cust_def456"
            }
        }, {
            file: {
                url: "https://example.com/multi-doc3.pdf"
            },
            metadata: {
                "customerId": "cust_ghi789"
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

**request:** `Extend.SplitRunsCreateBatchRequest` 
    
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
    name: "Document Splitter",
    config: {
        splitClassifications: [{
                id: "invoice",
                type: "invoice",
                description: "An invoice or bill for goods or services",
                identifierKey: "invoice number from the document header"
            }, {
                id: "receipt",
                type: "receipt",
                description: "A receipt confirming payment",
                identifierKey: "receipt number"
            }, {
                id: "other",
                type: "other",
                description: "Any other document type"
            }]
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

<details><summary><code>client.splitters.<a href="/src/api/resources/splitters/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.Splitter</code></summary>
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

**request:** `Extend.SplittersRetrieveRequest` 
    
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
await client.splitters.update("splitter_id_here", {
    name: "Document Splitter v2"
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
    releaseType: "minor",
    description: "Improved split boundary detection"
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

<details><summary><code>client.splitterVersions.<a href="/src/api/resources/splitterVersions/client/Client.ts">retrieve</a>(splitterId, versionId, { ...params }) -> Extend.SplitterVersion</code></summary>
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
await client.splitterVersions.retrieve("splitter_id_here", "draft");

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

The version to retrieve. Accepts any of the following:

- `"draft"` — returns the current draft version
- `"latest"` — returns the latest published version (falls back to draft if none published)
- A version number (e.g. `"0.1"`, `"1.0"`) — returns that specific published version
- A version ID (e.g. `"splv_QYk6jgHA_8CsO8rVWhyNC"`) — returns that specific version by ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.SplitterVersionsRetrieveRequest` 
    
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
<details><summary><code>client.workflows.<a href="/src/api/resources/workflows/client/Client.ts">list</a>({ ...params }) -> Extend.WorkflowsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all workflows. Returns a paginated list of workflow summaries.
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
await client.workflows.list({
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

**request:** `Extend.WorkflowsListRequest` 
    
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

<details><summary><code>client.workflows.<a href="/src/api/resources/workflows/client/Client.ts">create</a>({ ...params }) -> Extend.Workflow</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new workflow. Optionally provide `steps` to define the workflow's step graph.

When `steps` is omitted, the workflow is created with default steps (`TRIGGER` → `PARSE`). When `steps` is provided, the step graph is validated and the draft version is populated with the given steps.

**Note:** The default steps may change in the future. If your integration depends on a specific step graph, provide `steps` explicitly.
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

<details><summary><code>client.workflows.<a href="/src/api/resources/workflows/client/Client.ts">retrieve</a>(id) -> Extend.Workflow</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details of a workflow, including its draft version and steps.
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
await client.workflows.retrieve("workflow_abc123");

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

**id:** `string` — The ID of the workflow.
    
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

<details><summary><code>client.workflows.<a href="/src/api/resources/workflows/client/Client.ts">update</a>(id, { ...params }) -> Extend.Workflow</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a workflow's draft. You can update the name, the steps, or both.

When `steps` is provided, the draft version's steps are replaced with the new set. Steps with matching names from the previous draft preserve their internal identity.
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
await client.workflows.update("workflow_abc123", {
    name: "Updated Invoice Processing"
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

**id:** `string` — The ID of the workflow to update.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WorkflowsUpdateRequest` 
    
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

## WorkflowVersions
<details><summary><code>client.workflowVersions.<a href="/src/api/resources/workflowVersions/client/Client.ts">list</a>(id, { ...params }) -> Extend.WorkflowVersionsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all versions of a workflow, including the draft version. Returns a paginated list of version summaries.
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
await client.workflowVersions.list("workflow_abc123", {
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

**id:** `string` — The ID of the workflow.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WorkflowVersionsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowVersions.<a href="/src/api/resources/workflowVersions/client/Client.ts">create</a>(id, { ...params }) -> Extend.WorkflowVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deploy a new version of a workflow. The deployed version becomes available for running workflow runs.

When `steps` is omitted, the current draft is deployed as-is. When `steps` is provided, the given steps are deployed directly without modifying the draft.
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
await client.workflowVersions.create("workflow_abc123");

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

**id:** `string` — The ID of the workflow to deploy.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WorkflowVersionsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowVersionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workflowVersions.<a href="/src/api/resources/workflowVersions/client/Client.ts">retrieve</a>(id, versionId) -> Extend.WorkflowVersion</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a specific version of a workflow, including its step definitions.
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
await client.workflowVersions.retrieve("workflow_abc123", "draft");

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

**id:** `string` — The ID of the workflow.
    
</dd>
</dl>

<dl>
<dd>

**versionId:** `string` 

The version to retrieve. Accepts any of the following:

- `"draft"` — returns the current draft version
- `"latest"` — returns the latest published version (falls back to draft if none published)
- A version number (e.g. `"1"`, `"2"`) — returns that specific published version
- A version ID (e.g. `"workflow_version_abc123"`) — returns that specific version by ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowVersionsClient.RequestOptions` 
    
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

The request returns immediately with a `PROCESSING` status. Use webhooks or poll the Get Workflow Run endpoint for results.
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
        id: "wf_1234567890"
    },
    file: {
        url: "https://example.com/invoice.pdf"
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

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.WorkflowRun</code></summary>
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

**request:** `Extend.WorkflowRunsRetrieveRequest` 
    
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
await client.workflowRuns.update("workflow_run_id_here", {
    name: "Invoice #12345",
    metadata: {
        "customerId": "cust_abc123",
        "source": "email-inbox"
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

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">delete</a>(id, { ...params }) -> Extend.WorkflowRunsDeleteResponse</code></summary>
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

**request:** `Extend.WorkflowRunsDeleteRequest` 
    
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

<details><summary><code>client.workflowRuns.<a href="/src/api/resources/workflowRuns/client/Client.ts">cancel</a>(id, { ...params }) -> Extend.WorkflowRun</code></summary>
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

**request:** `Extend.WorkflowRunsCancelRequest` 
    
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

Unlike the single [Run Workflow](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/workflow/create-workflow-run) endpoint which returns the details of the created workflow runs immediately, this batch endpoint returns a `batchId`.

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
        id: "wf_1234567890"
    },
    inputs: [{
            file: {
                url: "https://example.com/invoice1.pdf"
            },
            metadata: {
                "customerId": "cust_abc123"
            }
        }, {
            file: {
                url: "https://example.com/invoice2.pdf"
            },
            metadata: {
                "customerId": "cust_def456"
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
- You can [configure webhooks](https://docs.extend.ai/2026-02-09/product/webhooks/configuration) to receive notifications when a processor run is complete or failed.
- Or you can [poll the get endpoint](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/legacy/get-processor-run) for updates on the status of the processor run.
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

<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">get</a>(id, { ...params }) -> Extend.ProcessorRunGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a specific processor run, including its status, outputs, and any edits made during review.

A common use case for this endpoint is to poll for the status and final output of an async processor run when using the [Run Processor](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/legacy/create-processor-run) endpoint. For instance, if you do not want to not configure webhooks to receive the output via completion/failure events.
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

**request:** `Extend.ProcessorRunGetRequest` 
    
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

<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">delete</a>(id, { ...params }) -> Extend.ProcessorRunDeleteResponse</code></summary>
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

**request:** `Extend.ProcessorRunDeleteRequest` 
    
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

<details><summary><code>client.processorRun.<a href="/src/api/resources/processorRun/client/Client.ts">cancel</a>(id, { ...params }) -> Extend.ProcessorRunCancelResponse</code></summary>
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

**request:** `Extend.ProcessorRunCancelRequest` 
    
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
<details><summary><code>client.processorVersion.<a href="/src/api/resources/processorVersion/client/Client.ts">list</a>(id, { ...params }) -> Extend.ProcessorVersionListResponse</code></summary>
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

**request:** `Extend.ProcessorVersionListRequest` 
    
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

<details><summary><code>client.processorVersion.<a href="/src/api/resources/processorVersion/client/Client.ts">get</a>(processorId, processorVersionId, { ...params }) -> Extend.ProcessorVersionGetResponse</code></summary>
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

**request:** `Extend.ProcessorVersionGetRequest` 
    
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
<details><summary><code>client.batchProcessorRun.<a href="/src/api/resources/batchProcessorRun/client/Client.ts">get</a>(id, { ...params }) -> Extend.BatchProcessorRunGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a batch processor run, including evaluation runs.

**Deprecated:** This endpoint is maintained for backwards compatibility only and will be replaced in a future API version. Use [Get Evaluation Set Run](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/evaluation/get-evaluation-set-run) for interacting with evaluation set runs.
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

**request:** `Extend.BatchProcessorRunGetRequest` 
    
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

## BatchRuns
<details><summary><code>client.batchRuns.<a href="/src/api/resources/batchRuns/client/Client.ts">get</a>(id) -> Extend.BatchRun</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the status of a batch run by its ID. The `status` field reflects the aggregate state of the batch.

This is a unified endpoint that works for batches created via any of the batch submission endpoints (`POST /extract_runs/batch`, `POST /classify_runs/batch`, `POST /split_runs/batch`).

| Status | Meaning |
|---|---|
| `PENDING` | Queued, not yet started |
| `PROCESSING` | Runs are actively being processed |
| `PROCESSED` | All runs have completed |
| `FAILED` | The batch encountered a fatal error |
| `CANCELLED` | The batch was cancelled |

To retrieve individual run results, use the List endpoint for the relevant processor type filtered by `batchId`:
- `GET /extract_runs?batchId={id}`
- `GET /classify_runs?batchId={id}`
- `GET /split_runs?batchId={id}`
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
await client.batchRuns.get("bpr_Xj8mK2pL9nR4vT7qY5wZ");

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

**requestOptions:** `BatchRunsClient.RequestOptions` 
    
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

Note: It is not necessary to create an evaluation set via API. You can also create an evaluation set via the Extend dashboard and take the ID from there. To learn more about how to create evaluation sets, see the [Evaluation Sets](https://docs.extend.ai/2026-02-09/product/evaluation/overview) product page.
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
    name: "Invoice Processing Test Set",
    description: "Q4 vendor invoices for accuracy testing",
    entityId: "ex_1234567890"
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

<details><summary><code>client.evaluationSets.<a href="/src/api/resources/evaluationSets/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.EvaluationSet</code></summary>
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

**request:** `Extend.EvaluationSetsRetrieveRequest` 
    
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

Learn more about how to create evaluation set items in the [Evaluation Sets](https://docs.extend.ai/2026-02-09/product/evaluation/overview) product page.
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
            fileId: "file_xK9mLPqRtN3vS8wF5hB2cQ",
            expectedOutput: {
                value: {
                    "vendor_name": "Acme Corp",
                    "invoice_number": "INV-001",
                    "total_amount": 1500
                }
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

<details><summary><code>client.evaluationSetItems.<a href="/src/api/resources/evaluationSetItems/client/Client.ts">retrieve</a>(evaluationSetId, itemId, { ...params }) -> Extend.EvaluationSetItem</code></summary>
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

**request:** `Extend.EvaluationSetItemsRetrieveRequest` 
    
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
    expectedOutput: {
        value: {
            "vendor_name": "Acme Corp",
            "invoice_number": "INV-001",
            "total_amount": 1750
        }
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

<details><summary><code>client.evaluationSetItems.<a href="/src/api/resources/evaluationSetItems/client/Client.ts">delete</a>(evaluationSetId, itemId, { ...params }) -> Extend.EvaluationSetItemsDeleteResponse</code></summary>
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

**request:** `Extend.EvaluationSetItemsDeleteRequest` 
    
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
<details><summary><code>client.evaluationSetRuns.<a href="/src/api/resources/evaluationSetRuns/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.EvaluationSetRun</code></summary>
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

**request:** `Extend.EvaluationSetRunsRetrieveRequest` 
    
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

## WebhookEndpoints
<details><summary><code>client.webhookEndpoints.<a href="/src/api/resources/webhookEndpoints/client/Client.ts">list</a>({ ...params }) -> Extend.WebhookEndpointsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all webhook endpoints.
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
await client.webhookEndpoints.list({
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

**request:** `Extend.WebhookEndpointsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookEndpointsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookEndpoints.<a href="/src/api/resources/webhookEndpoints/client/Client.ts">create</a>({ ...params }) -> Extend.WebhookEndpointCreate</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new webhook endpoint. The response includes a `signingSecret` that is only returned once — store it securely for verifying webhook signatures.

The `enabledEvents` array specifies which global event types this endpoint should receive. Use the [Webhook Events](https://docs.extend.ai/2026-02-09/developers/api-reference/webhook-events) reference to see available event types.

To subscribe to events scoped to a specific resource (e.g., a single extractor or workflow), use [Create Webhook Subscription](https://docs.extend.ai/2026-02-09/developers/api-reference/endpoints/webhook/create-webhook-subscription) after creating the endpoint.
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
await client.webhookEndpoints.create({
    url: "https://example.com/webhooks",
    name: "Production webhook",
    enabledEvents: ["extract_run.processed", "workflow.created"],
    apiVersion: "2026-02-09"
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

**request:** `Extend.WebhookEndpointsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookEndpointsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookEndpoints.<a href="/src/api/resources/webhookEndpoints/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.WebhookEndpoint</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a webhook endpoint by ID.
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
await client.webhookEndpoints.retrieve("webhook_endpoint_id_here");

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

The ID of the webhook endpoint.

Example: `"wh_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WebhookEndpointsRetrieveRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookEndpointsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookEndpoints.<a href="/src/api/resources/webhookEndpoints/client/Client.ts">update</a>(id, { ...params }) -> Extend.WebhookEndpoint</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a webhook endpoint. Only the fields you include in the request body will be updated; omitted fields remain unchanged.

The `apiVersion` of a webhook endpoint cannot be changed after creation.
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
await client.webhookEndpoints.update("webhook_endpoint_id_here");

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

The ID of the webhook endpoint to update.

Example: `"wh_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WebhookEndpointsUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookEndpointsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookEndpoints.<a href="/src/api/resources/webhookEndpoints/client/Client.ts">delete</a>(id, { ...params }) -> Extend.WebhookEndpointsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a webhook endpoint and all of its subscriptions. This operation is permanent and cannot be undone.
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
await client.webhookEndpoints.delete("webhook_endpoint_id_here");

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

The ID of the webhook endpoint to delete.

Example: `"wh_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WebhookEndpointsDeleteRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookEndpointsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## WebhookSubscriptions
<details><summary><code>client.webhookSubscriptions.<a href="/src/api/resources/webhookSubscriptions/client/Client.ts">list</a>({ ...params }) -> Extend.WebhookSubscriptionsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List webhook subscriptions. You can filter by `webhookEndpointId` to see all subscriptions for a given endpoint, or by `resourceId` to see all subscriptions for a given resource.
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
await client.webhookSubscriptions.list({
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

**request:** `Extend.WebhookSubscriptionsListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookSubscriptionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookSubscriptions.<a href="/src/api/resources/webhookSubscriptions/client/Client.ts">create</a>({ ...params }) -> Extend.WebhookSubscription</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a resource-scoped webhook subscription on an existing webhook endpoint.

Subscriptions let you receive events for a specific resource (e.g., a single extractor or workflow) rather than all resources of that type. The `enabledEvents` must be valid for the given `resourceType` and the endpoint's `apiVersion`.

If a subscription already exists for the same endpoint and resource, it will be updated with the new `enabledEvents` instead of creating a duplicate.
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
await client.webhookSubscriptions.create({
    webhookEndpointId: "wh_Xj8mK2pL9nR4vT7qY5wZ",
    resourceType: "extractor",
    resourceId: "ex_Xj8mK2pL9nR4vT7qY5wZ",
    enabledEvents: ["extract_run.processed", "extract_run.failed"]
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

**request:** `Extend.WebhookSubscriptionsCreateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookSubscriptionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookSubscriptions.<a href="/src/api/resources/webhookSubscriptions/client/Client.ts">retrieve</a>(id, { ...params }) -> Extend.WebhookSubscription</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a webhook subscription by ID.
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
await client.webhookSubscriptions.retrieve("webhook_subscription_id_here");

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

The ID of the webhook subscription.

Example: `"whes_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WebhookSubscriptionsRetrieveRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookSubscriptionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookSubscriptions.<a href="/src/api/resources/webhookSubscriptions/client/Client.ts">update</a>(id, { ...params }) -> Extend.WebhookSubscription</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the enabled events on a webhook subscription.
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
await client.webhookSubscriptions.update("webhook_subscription_id_here", {
    enabledEvents: ["extract_run.processed"]
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

The ID of the webhook subscription to update.

Example: `"whes_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WebhookSubscriptionsUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookSubscriptionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhookSubscriptions.<a href="/src/api/resources/webhookSubscriptions/client/Client.ts">delete</a>(id, { ...params }) -> Extend.WebhookSubscriptionsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a webhook subscription. This operation is permanent and cannot be undone.
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
await client.webhookSubscriptions.delete("webhook_subscription_id_here");

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

The ID of the webhook subscription to delete.

Example: `"whes_Xj8mK2pL9nR4vT7qY5wZ"`
    
</dd>
</dl>

<dl>
<dd>

**request:** `Extend.WebhookSubscriptionsDeleteRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhookSubscriptionsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
