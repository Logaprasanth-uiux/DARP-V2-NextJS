/**
 * Navigation Architecture Abstractions
 */

import React from 'react';

export interface RouteConfig {
  path: string;
  label?: string;
  icon?: string;
  component: React.ComponentType;
}
