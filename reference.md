# Reference

<details><summary><code>client.<a href="/src/Client.ts">parseAsync</a>({ ...params }) -> Extend.ParserRunStatus</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Parse files **asynchronously** to get cleaned, chunked target content (e.g. markdown).

The Parse Async endpoint allows you to convert documents into structured, machine-readable formats with fine-grained control over the parsing process. This endpoint is ideal for extracting cleaned document content to be used as context for downstream processing, e.g. RAG pipelines, custom ingestion pipelines, embeddings classification, etc.

Parse files asynchronously and get a parser run ID that can be used to check status and retrieve results with the [Get Parser Run](https://docs.extend.ai/2025-04-21/developers/api-reference/parse-endpoints/get-parser-run) endpoint.

This is useful for:

- Large files that may take longer to process
- Avoiding timeout issues with synchronous parsing.

For more details, see the [Parse File guide](/product/parsing/parse).

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
await client.parseAsync({
    file: {},
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

**request:** `Extend.ParseAsyncRequest`

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

##

## WorkflowRun

<details><summary><code>client.workflowRun.<a href="/src/api/resources/workflowRun/client/Client.ts">list</a>({ ...params }) -> Extend.WorkflowRunListResponse</code></summary>
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
await client.workflowRun.list({
    status: "PENDING",
    workflowId: "workflowId",
    batchId: "batchId",
    fileNameContains: "fileNameContains",
    sortBy: "updatedAt",
    sortDir: "asc",
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ=",
    maxPageSize: 1,
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

**request:** `Extend.WorkflowRunListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowRun.<a href="/src/api/resources/workflowRun/client/Client.ts">create</a>({ ...params }) -> Extend.WorkflowRunCreateResponse</code></summary>
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
await client.workflowRun.create({
    workflowId: "workflow_id_here",
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

**request:** `Extend.WorkflowRunCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowRun.<a href="/src/api/resources/workflowRun/client/Client.ts">get</a>(workflowRunId) -> Extend.WorkflowRunGetResponse</code></summary>
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
await client.workflowRun.get("workflow_run_id_here");
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

The ID of the WorkflowRun that was outputted after a Workflow was run through the API.

Example: `"workflow_run_8k9m-xyzAB_Pqrst-Nvw4"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowRun.<a href="/src/api/resources/workflowRun/client/Client.ts">update</a>(workflowRunId, { ...params }) -> Extend.WorkflowRunUpdateResponse</code></summary>
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
await client.workflowRun.update("workflow_run_id_here");
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

**request:** `Extend.WorkflowRunUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowRun.<a href="/src/api/resources/workflowRun/client/Client.ts">delete</a>(workflowRunId) -> Extend.WorkflowRunDeleteResponse</code></summary>
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
await client.workflowRun.delete("workflow_run_id_here");
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

The ID of the workflow run to delete.

Example: `"workflow_run_xKm9pNv3qWsY_jL2tR5Dh"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workflowRun.<a href="/src/api/resources/workflowRun/client/Client.ts">cancel</a>(workflowRunId) -> Extend.WorkflowRunCancelResponse</code></summary>
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
await client.workflowRun.cancel("workflow_run_id_here");
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

The ID of the workflow run to cancel.

Example: `"workflow_run_xKm9pNv3qWsY_jL2tR5Dh"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## BatchWorkflowRun

<details><summary><code>client.batchWorkflowRun.<a href="/src/api/resources/batchWorkflowRun/client/Client.ts">create</a>({ ...params }) -> Extend.BatchWorkflowRunCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This endpoint allows you to efficiently initiate large batches of workflow runs in a single request (up to 1,000 in a single request, but you can queue up multiple batches in rapid succession). It accepts an array of inputs, each containing a file and metadata pair. The primary use case for this endpoint is for doing large bulk runs of >1000 files at a time that can process over the course of a few hours without needing to manage rate limits that would likely occur using the primary run endpoint.

Unlike the single [Run Workflow](/developers/api-reference/workflow-endpoints/run-workflow) endpoint which returns the details of the created workflow runs immediately, this batch endpoint returns a `batchId`.

Our recommended usage pattern is to integrate with [Webhooks](/product/webhooks/configuration) for consuming results, using the `metadata` and `batchId` to match up results to the original inputs in your downstream systems. However, you can integrate in a polling mechanism by using a combination of the [List Workflow Runs](https://docs.extend.ai/2025-04-21/developers/api-reference/workflow-endpoints/list-workflow-runs) endpoint to fetch all runs via a batch, and then [Get Workflow Run](https://docs.extend.ai/2025-04-21/developers/api-reference/workflow-endpoints/get-workflow-run) to fetch the full outputs each run.

**Priority:** All workflow runs created through this batch endpoint are automatically assigned a priority of 90.

**Processing and Monitoring:**
Upon successful submission, the endpoint returns a `batchId`. The individual workflow runs are then queued for processing.

- **Monitoring:** Track the progress and consume results of individual runs using [Webhooks](/product/webhooks/configuration). Subscribe to events like `workflow_run.completed`, `workflow_run.failed`, etc. The webhook payload for these events will include the corresponding `batchId` and the `metadata` you provided for each input.
- **Fetching Results:** You can also use the [List Workflow Runs](https://docs.extend.ai/2025-04-21/developers/api-reference/workflow-endpoints/list-workflow-runs) endpoint and filter using the `batchId` query param.
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
await client.batchWorkflowRun.create({
    workflowId: "workflow_id_here",
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

**request:** `Extend.BatchWorkflowRunCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `BatchWorkflowRun.RequestOptions`

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
    status: "PENDING",
    processorId: "processorId",
    processorType: "EXTRACT",
    sourceId: "sourceId",
    source: "ADMIN",
    fileNameContains: "fileNameContains",
    sortBy: "updatedAt",
    sortDir: "asc",
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ=",
    maxPageSize: 1,
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

**requestOptions:** `ProcessorRun.RequestOptions`

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

- You can [configure webhooks](https://docs.extend.ai/2025-04-21/developers/webhooks/configuration) to receive notifications when a processor run is complete or failed.
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
    processorId: "processor_id_here",
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

**requestOptions:** `ProcessorRun.RequestOptions`

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

Example: `"dpr_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRun.RequestOptions`

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

Example: `"dpr_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRun.RequestOptions`

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

Example: `"dpr_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Processor

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

**request:** `Extend.ProcessorCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Processor.RequestOptions`

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

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ProcessorUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Processor.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ProcessorVersion

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

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**processorVersionId:** `string`

The ID of the specific processor version to retrieve.

Example: `"dpv_QYk6jgHA_8CsO8rVWhyNC"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorVersion.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

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

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorVersion.RequestOptions`

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

The ID of the processor to publish a new version for.

Example: `"dp_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ProcessorVersionCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProcessorVersion.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ParserRun

<details><summary><code>client.parserRun.<a href="/src/api/resources/parserRun/client/Client.ts">get</a>(id, { ...params }) -> Extend.ParserRunGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the status and results of a parser run.

Use this endpoint to get results for a parser run that has already completed, or to check on the status of an asynchronous parser run initiated via the [Parse File Asynchronously](https://docs.extend.ai/2025-04-21/developers/api-reference/parse-endpoints/parse-file-async) endpoint.

If parsing is still in progress, you'll receive a response with just the status. Once complete, you'll receive the full parsed content in the response.

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
await client.parserRun.get("parser_run_id_here", {
    responseType: "json",
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

The unique identifier for the parser run.

Example: `"parser_run_xK9mLPqRtN3vS8wF5hB2cQ"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.ParserRunGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ParserRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.parserRun.<a href="/src/api/resources/parserRun/client/Client.ts">delete</a>(id) -> Extend.ParserRunDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a parser run and all associated data from Extend. This operation is permanent and cannot be undone.

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
await client.parserRun.delete("parser_run_id_here");
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

The ID of the parser run to delete.

Example: `"parser_run_xK9mLPqRtN3vS8wF5hB2cQ"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ParserRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## File

<details><summary><code>client.file.<a href="/src/api/resources/file/client/Client.ts">list</a>({ ...params }) -> Extend.FileListResponse</code></summary>
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
await client.file.list({
    nameContains: "nameContains",
    sortDir: "asc",
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ=",
    maxPageSize: 1,
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

**request:** `Extend.FileListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `File_.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.file.<a href="/src/api/resources/file/client/Client.ts">get</a>(id, { ...params }) -> Extend.FileGetResponse</code></summary>
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
await client.file.get("file_id_here", {
    rawText: true,
    markdown: true,
    html: true,
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

Extend's ID for the file. It will always start with `"file_"`. This ID is returned when creating a new File, or the value on the `fileId` field in a WorkflowRun.

Example: `"file_Xj8mK2pL9nR4vT7qY5wZ"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.FileGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `File_.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.file.<a href="/src/api/resources/file/client/Client.ts">delete</a>(id) -> Extend.FileDeleteResponse</code></summary>
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
await client.file.delete("file_id_here");
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

**requestOptions:** `File_.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.file.<a href="/src/api/resources/file/client/Client.ts">upload</a>(file) -> Extend.FileUploadResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Upload and create a new file in Extend.

This endpoint accepts file contents and registers them as a File in Extend, which can be used for [running workflows](https://docs.extend.ai/2025-04-21/developers/api-reference/workflow-endpoints/run-workflow), [creating evaluation set items](https://docs.extend.ai/2025-04-21/developers/api-reference/evaluation-set-endpoints/bulk-create-evaluation-set-items), [parsing](https://docs.extend.ai/2025-04-21/developers/api-reference/parse-endpoints/parse-file), etc.

If an uploaded file is detected as a Word or PowerPoint document, it will be automatically converted to a PDF.

Supported file types can be found [here](/product/general/supported-file-types).

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
await client.file.upload(createReadStream("path/to/file"));
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

**requestOptions:** `File_.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## EvaluationSet

<details><summary><code>client.evaluationSet.<a href="/src/api/resources/evaluationSet/client/Client.ts">list</a>({ ...params }) -> Extend.EvaluationSetListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List evaluation sets in your account. You can use the `processorId` parameter to filter evaluation sets by processor.

This endpoint returns a paginated response. You can use the `nextPageToken` to fetch subsequent results.

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
await client.evaluationSet.list({
    processorId: "processor_id_here",
    sortBy: "updatedAt",
    sortDir: "asc",
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ=",
    maxPageSize: 1,
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

**request:** `Extend.EvaluationSetListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSet.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSet.<a href="/src/api/resources/evaluationSet/client/Client.ts">create</a>({ ...params }) -> Extend.EvaluationSetCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Evaluation sets are collections of files and expected outputs that are used to evaluate the performance of a given processor in Extend. This endpoint will create a new evaluation set in Extend, which items can be added to using the [Create Evaluation Set Item](https://docs.extend.ai/2025-04-21/developers/api-reference/evaluation-set-endpoints/create-evaluation-set-item) endpoint.

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
await client.evaluationSet.create({
    name: "My Evaluation Set",
    description: "My Evaluation Set Description",
    processorId: "processor_id_here",
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

**request:** `Extend.EvaluationSetCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSet.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSet.<a href="/src/api/resources/evaluationSet/client/Client.ts">get</a>(id) -> Extend.EvaluationSetGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific evaluation set by ID. This returns an evaluation set object, but does not include the items in the evaluation set. You can use the [List Evaluation Set Items](https://docs.extend.ai/2025-04-21/developers/api-reference/evaluation-set-endpoints/list-evaluation-set-items) endpoint to get the items in an evaluation set.

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
await client.evaluationSet.get("evaluation_set_id_here");
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

The ID of the evaluation set to retrieve.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSet.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## EvaluationSetItem

<details><summary><code>client.evaluationSetItem.<a href="/src/api/resources/evaluationSetItem/client/Client.ts">list</a>(id, { ...params }) -> Extend.EvaluationSetItemListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all items in a specific evaluation set. Evaluation set items are the individual files and expected outputs that are used to evaluate the performance of a given processor in Extend.

This endpoint returns a paginated response. You can use the `nextPageToken` to fetch subsequent results.

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
await client.evaluationSetItem.list("evaluation_set_id_here", {
    sortBy: "updatedAt",
    sortDir: "asc",
    nextPageToken: "xK9mLPqRtN3vS8wF5hB2cQ==:zWvUxYjM4nKpL7aDgE9HbTcR2mAyX3/Q+CNkfBSw1dZ=",
    maxPageSize: 1,
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

The ID of the evaluation set to retrieve items for.

Example: `"ev_2LcgeY_mp2T5yPaEuq5Lw"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.EvaluationSetItemListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItem.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetItem.<a href="/src/api/resources/evaluationSetItem/client/Client.ts">create</a>({ ...params }) -> Extend.EvaluationSetItemCreateResponse</code></summary>
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
await client.evaluationSetItem.create({
    evaluationSetId: "evaluation_set_id_here",
    fileId: "file_id_here",
    expectedOutput: {
        value: {
            key: "value",
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

**request:** `Extend.EvaluationSetItemCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItem.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetItem.<a href="/src/api/resources/evaluationSetItem/client/Client.ts">update</a>(id, { ...params }) -> Extend.EvaluationSetItemUpdateResponse</code></summary>
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
await client.evaluationSetItem.update("evaluation_set_item_id_here", {
    expectedOutput: {
        value: {
            key: "value",
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

The ID of the evaluation set item to update.

Example: `"evi_kR9mNP12Qw4yTv8BdR3H"`

</dd>
</dl>

<dl>
<dd>

**request:** `Extend.EvaluationSetItemUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItem.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluationSetItem.<a href="/src/api/resources/evaluationSetItem/client/Client.ts">createBatch</a>({ ...params }) -> Extend.EvaluationSetItemCreateBatchResponse</code></summary>
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
await client.evaluationSetItem.createBatch({
    evaluationSetId: "evaluation_set_id_here",
    items: [
        {
            fileId: "file_id_here",
            expectedOutput: {
                value: {
                    key: "value",
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

**request:** `Extend.EvaluationSetItemCreateBatchRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `EvaluationSetItem.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## WorkflowRunOutput

<details><summary><code>client.workflowRunOutput.<a href="/src/api/resources/workflowRunOutput/client/Client.ts">update</a>(workflowRunId, outputId, { ...params }) -> Extend.WorkflowRunOutputUpdateResponse</code></summary>
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
await client.workflowRunOutput.update("workflow_run_id_here", "output_id_here", {
    reviewedOutput: {
        value: {
            key: "value",
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

**request:** `Extend.WorkflowRunOutputUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkflowRunOutput.RequestOptions`

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
await client.batchProcessorRun.get("batch_processor_run_id_here");
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

**requestOptions:** `BatchProcessorRun.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Workflow

<details><summary><code>client.workflow.<a href="/src/api/resources/workflow/client/Client.ts">create</a>({ ...params }) -> Extend.WorkflowCreateResponse</code></summary>
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
await client.workflow.create({
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

**request:** `Extend.WorkflowCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Workflow.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
