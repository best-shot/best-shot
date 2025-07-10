#!/usr/bin/env node --trace-deprecation --env-file-if-exists .best-shot/.env
import { create } from './create.mjs';

create();
