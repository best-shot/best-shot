#!/usr/bin/env node --experimental-strip-types --env-file-if-exists .best-shot/.env
import { create } from './create.mjs';

create();
