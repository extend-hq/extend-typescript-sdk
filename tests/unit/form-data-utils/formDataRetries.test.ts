import http from "http";
import type { AddressInfo } from "net";
import { Readable } from "stream";
import { fetcherImpl } from "../../../src/core/fetcher/Fetcher";
import type { Uploadable } from "../../../src/core/file/types";
import { newFormData } from "../../../src/core/form-data-utils/FormDataWrapper";

interface ReceivedRequest {
    contentType: string | undefined;
    body: Buffer;
}

/**
 * Answers the first request with a retryable status and every later request with 200,
 * recording each request body so the test can assert that retries resend the full payload.
 */
function startFlakyServer(): Promise<{ url: string; received: ReceivedRequest[]; close: () => Promise<void> }> {
    const received: ReceivedRequest[] = [];
    const server = http.createServer((req, res) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => {
            received.push({ contentType: req.headers["content-type"], body: Buffer.concat(chunks) });
            if (received.length === 1) {
                res.writeHead(429, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "rate limited" }));
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
        });
    });
    server.keepAliveTimeout = 0;
    return new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () => {
            const { port } = server.address() as AddressInfo;
            resolve({
                url: `http://127.0.0.1:${port}/upload`,
                received,
                close: () =>
                    new Promise<void>((done) => {
                        server.closeAllConnections();
                        server.close(() => done());
                    }),
            });
        });
    });
}

describe("multipart request bodies survive retries", () => {
    const payload = Buffer.alloc(2048, 7);
    const filename = "test.pdf";

    const cases: Array<[string, () => Uploadable.FileLike]> = [
        ["Blob", () => new Blob([payload], { type: "application/pdf" })],
        ["Readable stream", () => Readable.from([payload])],
        ["Buffer", () => Buffer.from(payload)],
    ];

    it.each(cases)(
        "resends the full %s part after a 429",
        async (_label, makeData) => {
            const server = await startFlakyServer();
            try {
                const form = await newFormData();
                await form.appendFile("file", { data: makeData(), filename });
                form.append("password", "hunter2");
                const request = await form.getRequest();

                const result = await fetcherImpl({
                    url: server.url,
                    method: "POST",
                    headers: request.headers,
                    requestType: "file",
                    duplex: request.duplex,
                    body: request.body,
                    maxRetries: 1,
                    responseType: "json",
                });

                expect(result.ok).toBe(true);
                expect(server.received).toHaveLength(2);
                for (const { contentType, body } of server.received) {
                    expect(contentType).toMatch(/^multipart\/form-data; boundary=/);
                    expect(body.includes(`filename="${filename}"`)).toBe(true);
                    expect(body.includes('name="password"')).toBe(true);
                    expect(body.includes(payload)).toBe(true);
                }
            } finally {
                await server.close();
            }
        },
        15_000,
    );
});
