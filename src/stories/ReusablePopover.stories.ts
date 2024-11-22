import type { Meta, StoryObj } from '@storybook/react';
// import { expect, userEvent, within } from '@storybook/test';

// import { Page } from './Page';
// @ts-ignore
import { DummyComponent } from '../TestEntry';

const meta = {
    title: 'Components/ReusablePopover',
    component: DummyComponent,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof DummyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// // More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
// export const LoggedIn: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const loginButton = canvas.getByRole('button', { name: /Log in/i });
//     await expect(loginButton).toBeInTheDocument();
//     await userEvent.click(loginButton);
//     await expect(loginButton).not.toBeInTheDocument();

//     const logoutButton = canvas.getByRole('button', { name: /Log out/i });
//     await expect(logoutButton).toBeInTheDocument();
//   },
// };
