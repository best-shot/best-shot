#!/usr/bin/env node --trace-deprecation --experimental-strip-types --env-file-if-exists .best-shot/.env
import { create } from './create.mjs';

create();
