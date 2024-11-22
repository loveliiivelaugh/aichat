import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import Breadcrumbs from 'mf2/Breadcrumbs';

const meta = {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};