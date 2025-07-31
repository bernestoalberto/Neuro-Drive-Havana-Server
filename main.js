"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
var multer_1 = require("multer");
var app = (0, express_1["default"])();
var PORT = 8000;
// Loading modules
var analyze_ts_1 = require("./src/analyze.ts");
var body_parser_1 = require("body-parser");
var search_ts_1 = require("./src/search.ts");
// Multer Configuration
var storage = multer_1["default"].diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Store images in an 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Maintain original filename
    }
});
// Multer Setup (For handling file uploads)
var upload = (0, multer_1["default"])({ storage: storage });
// const upload = multer({ dest: 'uploads/' });
// Middleware
// parse application/x-www-form-urlencoded
app.use(body_parser_1["default"].urlencoded({ extended: false }));
app.use((0, cors_1["default"])());
// parse application/json
app.use(body_parser_1["default"].json());
// app.use(express.json()); // Middleware for parsing JSON request bodies
app.post("/uploadImage", upload.array("image"), function (req, res) {
    if (!req.body.file) {
        res.status(400).send("Error: No file uploaded.");
    }
    else {
        res.send("Image uploaded successfully!");
    }
});
app.post("/setCustomClaims", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idToken, claims;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                idToken = req.body.idToken;
                return [4 /*yield*/, getAuth().verifyIdToken(idToken)];
            case 1:
                claims = _a.sent();
                if (!(typeof claims.email !== "undefined" &&
                    typeof claims.email_verified !== "undefined" &&
                    claims.email_verified &&
                    claims.email.endsWith("@admin.example.com"))) return [3 /*break*/, 3];
                // Add custom claims for additional privileges.
                return [4 /*yield*/, getAuth().setCustomUserClaims(claims.sub, {
                        admin: true
                    })];
            case 2:
                // Add custom claims for additional privileges.
                _a.sent();
                // Tell client to refresh token on user.
                res.end(JSON.stringify({
                    status: "success"
                }));
                return [3 /*break*/, 4];
            case 3:
                // Return nothing.
                res.end(JSON.stringify({ status: "ineligible" }));
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/llama", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, search_ts_1.llamaSemanticSearch)(req.body.query)];
            case 1:
                result = _a.sent();
                console.log({ result: result });
                res.json({ result: result });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/gemini", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.dir(req.body.query);
                return [4 /*yield*/, (0, search_ts_1.geminiSemanticSearch)(req.body.query)];
            case 1:
                result = _a.sent();
                console.log({ result: result });
                res.json({ result: result });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/openai", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, search_ts_1.openAISemanticSearch)(req.body.query)];
            case 1:
                result = _a.sent();
                console.log({ result: result });
                res.json({ result: result });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Error with ChatGPT request:", error_3);
                res.status(500).send("Error communicating with ChatGPT");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/search", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, search_ts_1.semanticSearch)(req.body.query)];
            case 1:
                result = _a.sent();
                console.log({ result: result });
                res.json({ result: result });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/analyze", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var analysis, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body.query.text);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, analyze_ts_1.analyzeData)(req.body.query.text)];
            case 2:
                analysis = _a.sent();
                console.log(analysis);
                res.json(analysis);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).json({ error: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT, "."));
});
function getAuth() {
    return getAuth()
        .getUserByEmail("user@admin.example.com")
        .then(function (user) {
        // Confirm user is verified.
        if (user.emailVerified) {
            // Add custom claims for additional privileges.
            // This will be picked up by the user on token refresh or next sign in on new device.
            return getAuth().setCustomUserClaims(user.uid, {
                admin: true
            });
        }
    })["catch"](function (error) {
        console.log(error);
    });
}
