import { Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

import styles from "../styles/component/footer.module.scss";

function Footer() {
  return (
    <section className={styles.footerWrapper}>
      <footer className={styles.footer}>
        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid item xs="auto" className="!w-full sm:!w-auto">
            <Typography
              className={styles.copyRightContent}
              sx={{ textWrap: "pre-wrap", whiteSpace: "pre-wrap" }}
            >
              © 2025 Macros and meals. All Rights Reserved.
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Stack className={styles.footerlinksWrapper}>
              <Link href="/terms-condition" className={styles.footerlinks}>
                Terms & Condition
              </Link>
              <Link href="/privacy-policy" className={styles.footerlinks}>
                Privacy Policy
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </footer>
    </section>
  );
}

export default Footer;
