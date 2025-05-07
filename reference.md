# Reference

## WorkflowEndpoints

<details><summary><code>client.workflowEndpoints.<a href="/src/api/resources/workflowEndpoints/client/Client.ts">listWorkflowRuns</a>({ ...params }) -> Extend.GetWorkflowRunsResponse</code></summary>
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
await client.workflowEndpoints.listWorkflowRuns({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ=",
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

**request:** `Extend.GetWorkflowRunsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowEndpoints.<a href="/src/api/resources/workflowEndpoints/client/Client.ts">runWorkflow</a>({ ...params }) -> Extend.PostWorkflowRunsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Run a Workflow with files. A Workflow is a sequence of steps that process files and data in a specific order to achieve a desired outcome. A WorkflowRun will be created for each file processed. A WorkflowRun represents a single execution of a workflow against a file.

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
await client.workflowEndpoints.runWorkflow({
    workflowId: "<workflow_id_here>",
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

**request:** `Extend.PostWorkflowRunsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowEndpoints.<a href="/src/api/resources/workflowEndpoints/client/Client.ts">getWorkflowRun</a>(workflowRunId) -> Extend.GetWorkflowRunsWorkflowRunIdResponse</code></summary>
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
await client.workflowEndpoints.getWorkflowRun("<workflow_run_id_here>");
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

**workflowRunId:** `string`

The ID of the WorkflowRun that was outputted after a Workflow was run through the API. The ID will start with "workflow_run". This ID can be found when creating a WorkflowRun via API, or when viewing the "history" tab of a workflow on the Extend platform.

Example: `"workflow_run_8k9m-xyzAB_Pqrst-Nvw4"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowEndpoints.<a href="/src/api/resources/workflowEndpoints/client/Client.ts">updateWorkflowRun</a>(workflowRunId, { ...params }) -> Extend.PostWorkflowRunsWorkflowRunIdResponse</code></summary>
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
await client.workflowEndpoints.updateWorkflowRun("<workflow_run_id_here>");
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

**workflowRunId:** `string`

The ID of the WorkflowRun. This ID will start with "workflow_run". This ID can be found in the API response when creating a Workflow Run, or in the "history" tab of a workflow on the Extend platform.

Example: `"workflow_run_8k9m-xyzAB_Pqrst-Nvw4"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.PostWorkflowRunsWorkflowRunIdRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowEndpoints.<a href="/src/api/resources/workflowEndpoints/client/Client.ts">batchRunWorkflow</a>({ ...params }) -> Extend.PostWorkflowRunsBatchResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to efficiently initiate large batches of workflow runs in a single request (up to 1,000 in a single request, but you can queue up multiple batches in rapid succession). It accepts an array of inputs, each containing a file and metadata pair. The primary use case for this endpoint is for doing large bulk runs of >1000 files at a time that can process over the course of a few hours without needing to manage rate limits that would likely occur using the primary run endpoint.

Unlike the single [Run Workflow](/developers/api-reference/workflow-endpoints/run-workflow) endpoint which returns the details of the created workflow runs immediately, this batch endpoint returns a `batchId`.

Our recommended usage pattern is to integrate with [Webhooks](/developers/webhooks/configuration) for consuming results, using the `metadata` and `batchId` to match up results to the original inputs in your downstream systems. However, you can integrate in a polling mechanism by using a combination of the [List Workflow Runs](/developers/workflow-endpoints/list-workflow-runs) endpoint to fetch all runs via a batch, and then [Get Workflow Run](/developers/workflow-endpoints/get-workflow-run) to fetch the full outputs each run.

**Processing and Monitoring:**
Upon successful submission, the endpoint returns a `batchId`. The individual workflow runs are then queued for processing.

- **Monitoring:** Track the progress and consume results of individual runs using [Webhooks](/developers/webhooks/configuration). Subscribe to events like `workflow_run.completed`, `workflow_run.failed`, etc. The webhook payload for these events will include the corresponding `batchId` and the `metadata` you provided for each input.
- **Fetching Results:** You can also use the [List Workflow Runs](/developers/api-reference/workflow-endpoints/list-workflow-runs) endpoint and filter using the `batchId` query param.

**Error Responses**

Common errors include:

**400 Bad Request**: Invalid request body (e.g., missing required fields, array size limits exceeded, issues with `fileUrl` or `fileId`). The response body will contain an `error` message detailing the specific validation issues. Can also indicate issues accessing a provided `fileUrl`.

**401 Unauthorized**: Missing or invalid API token.

**403 Forbidden**: The API token does not have permission to access the specified workflow.

**404 Not Found**: The specified `workflowId` or `version` does not exist.

**429 Too Many Requests**: The request was rate limited. Please try again later.

**500 Internal Server Error**: An unexpected error occurred on the server.

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
await client.workflowEndpoints.batchRunWorkflow({
    workflowId: "<workflow_id_here>",
    inputs: [{}],
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

**request:** `Extend.PostWorkflowRunsBatchRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowEndpoints.<a href="/src/api/resources/workflowEndpoints/client/Client.ts">correctWorkflowRunOutputs</a>(workflowRunId, outputId, { ...params }) -> Extend.PostWorkflowRunsWorkflowRunIdOutputsOutputIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Use this endpoint to submit corrected outputs for a WorkflowRun for future processor evaluation and tuning in Extend.

If you are using our Human-in-the-loop workflow review, then we already will be collecting your operator submitted corrections. However, if you are receiving data via the API without human review, there could be incorrect outputs that you would like to correct for future usage in evaluation and tuning within the Extend platform. This endpoint allows you to submit corrected outputs for a WorkflowRun, by providing the correct output for a given output ID.

The output ID, would be found in a given entry within the outputs arrays of a Workflow Run payload. The ID would look something like `dpr_gwkZZNRrPgkjcq0y-***`.

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
await client.workflowEndpoints.correctWorkflowRunOutputs("workflowRunId", "outputId", {
    reviewedOutput: {
        key: "value",
    },
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

**workflowRunId:** `string`

</dd>
</dl>

<dl>
<dd>

**outputId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.PostWorkflowRunsWorkflowRunIdOutputsOutputIdRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowEndpoints.<a href="/src/api/resources/workflowEndpoints/client/Client.ts">createWorkflow</a>({ ...params }) -> Extend.PostWorkflowsResponse</code></summary>
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
await client.workflowEndpoints.createWorkflow({
    name: "Invoice Processing",
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

**request:** `Extend.PostWorkflowsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ProcessorEndpoints

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">runProcessor</a>({ ...params }) -> Extend.PostProcessorRunsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Run processors (extraction, classification, splitting, etc.) on a given document.

In general, the recommended way to integrate with Extend in production is via workflows, using the [Run Workflow](/developers/api-reference/workflow-endpoints/run-workflow) endpoint. This is due to several factors:

- file parsing/pre-processing will automatically be reused across multiple processors, which will give you simplicity and cost savings given that many use cases will require multiple processors to be run on the same document.
- workflows provide dedicated human in the loop document review, when needed.
- workflows allow you to model and manage your pipeline with a single endpoint and corresponding UI for modeling and monitoring.

However, there are a number of legitimate use cases and systems where it might be easier to model the pipeline via code and run processors directly. This endpoint is provided for this purpose.

Similar to workflow runs, processor runs are asynchronous and will return a status of `PROCESSING` until the run is complete. You can [configure webhooks](/developers/webhooks/configuration) to receive notifications when a processor run is complete or failed.

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
await client.processorEndpoints.runProcessor({
    processorId: "<processor_id_here>",
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

**request:** `Extend.PostProcessorRunsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">getProcessorRun</a>(id) -> Extend.GetProcessorRunsIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a specific processor run, including its status, outputs, and any edits made during review.

A common use case for this endpoint is to poll for the status and final output of an async processor run when using the [Run Processor](/developers/api-reference/processor-endpoints/run-processor) endpoint. For instance, if you do not want to not configure webhooks to receive the output via completion/failure events.

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
await client.processorEndpoints.getProcessorRun("<processor_run_id_here>");
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

The unique identifier for this processor run. The ID will start with "dpr\_". This can be fetched from the API response when running a processor, or from the Extend UI in the "history" tab of a processor.

Example: `"dpr_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">createProcessor</a>({ ...params }) -> Extend.PostProcessorsResponse</code></summary>
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
await client.processorEndpoints.createProcessor({
    name: "My Processor Name",
    type: "EXTRACT",
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

**request:** `Extend.PostProcessorsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">getProcessorVersion</a>(processorId, processorVersionId) -> Extend.GetProcessorsProcessorIdVersionsProcessorVersionIdResponse</code></summary>
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
await client.processorEndpoints.getProcessorVersion("<processor_id_here>", "<processor_version_id_here>");
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

The ID of the processor. The ID will start with "dp\_".

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**processorVersionId:** `string`

The ID of the specific processor version to retrieve. The ID will start with "dpv\_".

Example: `"dpv_QYk6jgHA_8CsO8rVWhyNC"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">listProcessorVersions</a>(id) -> Extend.GetProcessorsIdVersionsResponse</code></summary>
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
await client.processorEndpoints.listProcessorVersions("<processor_id_here>");
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

The ID of the processor to retrieve versions for. The ID will start with "dp\_".

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">publishProcessorVersion</a>(id, { ...params }) -> Extend.PostProcessorsIdPublishResponse</code></summary>
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
await client.processorEndpoints.publishProcessorVersion("<processor_id_here>", {
    releaseType: "major",
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

The ID of the processor to publish a new version for. The ID will start with "dp\_".

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.PostProcessorsIdPublishRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">getBatchProcessorRun</a>(id) -> Extend.GetBatchProcessorRunsIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details about a batch processor run, including evaluation runs

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
await client.processorEndpoints.getBatchProcessorRun("<batch_processor_run_id_here>");
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

The unique identifier of the batch processor run to retrieve. The ID will always start with "bpr\_".

Example: `"bpr_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.processorEndpoints.<a href="/src/api/resources/processorEndpoints/client/Client.ts">updateProcessor</a>(id, { ...params }) -> Extend.PostProcessorsIdResponse</code></summary>
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
await client.processorEndpoints.updateProcessor("<processor_id_here>");
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

The ID of the processor to update. The ID will start with "dp\_".

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.PostProcessorsIdRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ParseEndpoints

<details><summary><code>client.parseEndpoints.<a href="/src/api/resources/parseEndpoints/client/Client.ts">parseFile</a>({ ...params }) -> Extend.PostParseResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Parse files to get cleaned, chunked target content (e.g. markdown).

The Parse endpoint allows you to convert documents into structured, machine-readable formats with fine-grained control over the parsing process. This endpoint is ideal for extracting cleaned document content to be used as context for downstream processing, e.g. RAG pipelines, custom ingestion pipelines, embeddings classification, etc.

Unlike processor and workflow runs, parsing is a synchronous endpoint and returns the parsed content in the response. Expected latency depends primarily on file size. This makes it suitable for workflows where you need immediate access to document content without waiting for asynchronous processing.

For more details, see the [Parse File guide](/developers/guides/parse).

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
await client.parseEndpoints.parseFile({
    file: {},
    config: {},
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

**request:** `Extend.PostParseRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ParseEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## FileEndpoints

<details><summary><code>client.fileEndpoints.<a href="/src/api/resources/fileEndpoints/client/Client.ts">listFiles</a>({ ...params }) -> Extend.GetFilesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List files in your account. Files represent documents that have been uploaded to Extend. This endpoint returns a paginated response. You can use the `nextPageToken` to fetch subsequent results.

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
await client.fileEndpoints.listFiles({
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ=",
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

**request:** `Extend.GetFilesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FileEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.fileEndpoints.<a href="/src/api/resources/fileEndpoints/client/Client.ts">createFileDeprecated</a>({ ...params }) -> Extend.PostFilesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new file in Extend for use in an evaluation set. This endpoint is deprecated, use /files/upload instead.

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
await client.fileEndpoints.createFileDeprecated();
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

**request:** `Extend.PostFilesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FileEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.fileEndpoints.<a href="/src/api/resources/fileEndpoints/client/Client.ts">getFile</a>(id, { ...params }) -> Extend.GetFilesIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fetch a file by its ID to obtain additional details and the raw file content.

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
await client.fileEndpoints.getFile("<file_id_here>");
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

Extend's ID for the file. It will always start with `"file_"`. This ID is returned when creating a new File, or the value on the `fileId` field in a WorkflowRun.

Example: `"file_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.GetFilesIdRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `FileEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.fileEndpoints.<a href="/src/api/resources/fileEndpoints/client/Client.ts">uploadFile</a>(file) -> Extend.PostFilesUploadResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Upload and create a new file in Extend.

This endpoint accepts file contents and registers them as a File in Extend, which can be used for [running workflows](/developers/api-reference/workflow-endpoints/run-workflow), [creating evaluation sets](/developers/api-reference/evaluation-set-endpoints/bulk-create-evaluation-set-items), [parsing](/developers/api-reference/parse-endpoints/parse-file), etc.

If an uploaded file is detected as a Word or PowerPoint document, it will be automatically converted to a PDF.

Supported file types can be found [here](/developers/guides/supported-file-types).

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
await client.fileEndpoints.uploadFile(fs.createReadStream("/path/to/your/file"));
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

**requestOptions:** `FileEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## EvaluationSetEndpoints

<details><summary><code>client.evaluationSetEndpoints.<a href="/src/api/resources/evaluationSetEndpoints/client/Client.ts">createEvaluationSet</a>({ ...params }) -> Extend.PostEvaluationSetsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Evaluation sets are a collection of files and expected outputs that are used to evaluate the performance of a given processor in Extend. This endpoint will create a new evaluation set in Extend, which items can be added to using the [Create Evaluation Set Item](/developers/api-reference/evaluation-set-endpoints/create-evaluation-set-item) endpoint.

Note: it is not necessary to create an evaluation set via API. You can also create an evaluation set via the Extend dashboard and take the ID from there.

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
await client.evaluationSetEndpoints.createEvaluationSet({
    name: "My Evaluation Set",
    description: "My Evaluation Set Description",
    processorId: "<processor_id_here>",
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

**request:** `Extend.PostEvaluationSetsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetEndpoints.<a href="/src/api/resources/evaluationSetEndpoints/client/Client.ts">createEvaluationSetItem</a>({ ...params }) -> Extend.PostEvaluationSetItemsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Evaluation set items are the individual files and expected outputs that are used to evaluate the performance of a given processor in Extend. This endpoint will create a new evaluation set item in Extend, which will be used during an evaluation run.

Best Practices for Outputs in Evaluation Sets:

- **Configure First, Output Later**
    - Always create and finalize your processor configuration before creating evaluation sets
    - Field IDs in outputs must match those defined in your processor configuration
- **Type Consistency**
    - Ensure output types exactly match your processor configuration
    - For example, if a field is configured as "currency", don't submit a simple number value
- **Field IDs**
    - Use the exact field IDs from your processor configuration
    - Create your own semantic IDs instead in the configs for each field/type instead of using the generated ones
- **Value**
    - Remember that all results are inside the value key of a result object, except the values within nested structures.
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
await client.evaluationSetEndpoints.createEvaluationSetItem({
    evaluationSetId: "<evaluation_set_id_here>",
    fileId: "<file_id_here>",
    expectedOutput: {
        value: {
            key: "value",
        },
        metadata: {
            key: {},
        },
    },
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

**request:** `Extend.PostEvaluationSetItemsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetEndpoints.<a href="/src/api/resources/evaluationSetEndpoints/client/Client.ts">updateEvaluationSetItem</a>(id, { ...params }) -> Extend.PostEvaluationSetItemsIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

If you need to change the expected output for a given evaluation set item, you can use this endpoint to update the item. This can be useful if you need to correct an error in the expected output or if the output of the processor has changed.

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
await client.evaluationSetEndpoints.updateEvaluationSetItem("<evaluation_set_item_id_here>", {
    expectedOutput: {
        value: {
            key: "value",
        },
        metadata: {
            key: {},
        },
    },
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

The ID of the evaluation set item to update. The ID will start with "evi\_".

Example: `"evi_kR9mNP12Qw4yTv8BdR3H"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.PostEvaluationSetItemsIdRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetEndpoints.<a href="/src/api/resources/evaluationSetEndpoints/client/Client.ts">bulkCreateEvaluationSetItems</a>({ ...params }) -> Extend.PostEvaluationSetItemsBulkResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

If you have a large number of files that you need to add to an evaluation set, you can use this endpoint to create multiple evaluation set items at once. This can be useful if you have a large dataset that you need to evaluate the performance of a processor against.

Note: you still need to create each File first using the file API.

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
await client.evaluationSetEndpoints.bulkCreateEvaluationSetItems({
    evaluationSetId: "<evaluation_set_id_here>",
    items: [
        {
            fileId: "<file_id_here>",
            expectedOutput: {
                value: {
                    key: "value",
                },
                metadata: {
                    key: {},
                },
            },
        },
    ],
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

**request:** `Extend.PostEvaluationSetItemsBulkRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetEndpoints.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
